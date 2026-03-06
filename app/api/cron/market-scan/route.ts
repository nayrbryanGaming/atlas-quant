import { NextResponse } from 'next/server';
import { ENV } from '@/config/env';
import { CONSTANTS } from '@/config/constants';
import { CoinGeckoProvider } from '@/services/market/coingecko';
import { analyzeMarket, measureVolatility } from '@/core/quant';
import { GroqAssist } from '@/core/ai/groq';
import { signalCache } from '@/core/cache/runtime';
import { AssetSignals, MarketScanData } from '@/domain/signal';
import { logger } from '@/utils/logger';
import { getUnixTimestamp } from '@/utils/time';

// Max duration for Vercel Hobby/Pro Serverless
export const maxDuration = 60;

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get('authorization');
        if (authHeader !== `Bearer ${ENV.CRON_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        logger.info('Starting Cron Market Scan');
        const marketProvider = new CoinGeckoProvider();
        const aiAssist = new GroqAssist();

        // 1. Fetch Global Snapshot and Filter Active Universe
        const globalScan = await marketProvider.getGlobalScan();
        if (globalScan.length === 0) {
            throw new Error('Global scan returned empty, aborting.');
        }

        // Filter Top N by volume
        const activeUniverse = globalScan
            .sort((a: MarketScanData, b: MarketScanData) => b.volume24h - a.volume24h)
            .slice(0, CONSTANTS.MAX_ACTIVE_UNIVERSE);

        const snapshotSignals: AssetSignals[] = [];

        // 2. Process Active Universe
        for (const asset of activeUniverse) {
            try {
                const ohlc = await marketProvider.getOHLC(asset.symbol, CONSTANTS.CANDLES_TO_FETCH);
                if (ohlc.length < 50) {
                    logger.warn(`Insufficient OHLC data for ${asset.symbol}`);
                    continue;
                }

                const quantOutput = analyzeMarket({ symbol: asset.symbol, candles: ohlc });

                // Updated T1MO signatures (measureVolatility uses H-L-C)
                const high = ohlc.map(c => c.high);
                const low = ohlc.map(c => c.low);
                const close = ohlc.map(c => c.close);

                let aiOutput = undefined;
                if (ENV.FEATURE_AI_ENABLED) {
                    // Pass only quantOutput to AI as per contract
                    aiOutput = await aiAssist.analyzeContext(quantOutput);
                }

                const signal: AssetSignals = {
                    symbol: asset.symbol,
                    price: close[close.length - 1],
                    quant: quantOutput,
                    ai: aiOutput,
                    timestamp: getUnixTimestamp(),
                };

                snapshotSignals.push(signal);

                // Cache individually and globally
                signalCache.set(`signal:${asset.symbol}`, signal, CONSTANTS.CACHE_TTL_MS);
                signalCache.set(`candles:${asset.symbol}`, ohlc, CONSTANTS.CACHE_TTL_MS);
            } catch (err) {
                logger.error(`Failed to process asset ${asset.symbol}`, err);
            }
        }

        // Cache the whole snapshot list
        signalCache.set('signal:snapshot', snapshotSignals, CONSTANTS.CACHE_TTL_MS);
        signalCache.set('active_universe', activeUniverse, CONSTANTS.CACHE_TTL_MS);

        logger.info(`Cron finished successfully. Processed ${snapshotSignals.length} assets.`);
        return NextResponse.json({ success: true, processed: snapshotSignals.length });
    } catch (error) {
        logger.error('CRON Fatal Error', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

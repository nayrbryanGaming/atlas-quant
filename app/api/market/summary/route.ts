import { NextResponse } from 'next/server';
import { verifySessionToken } from '@/utils/auth-middleware';
import { signalCache } from '@/core/cache/runtime';

export async function GET(request: Request) {
    const userKey = verifySessionToken(request);
    if (!userKey) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Market routes must only read from cache explicitly according to spec
    let activeUniverse = signalCache.get('active_universe');
    let snapshotSignals = signalCache.get('signal:snapshot');

    if (!activeUniverse || !snapshotSignals) {
        // Fallback: Trigger on-demand scan if cache miss due to serverless isolation
        try {
            const { CoinGeckoProvider } = await import('@/services/market/coingecko');
            const { analyzeMarket } = await import('@/core/quant');
            const { getUnixTimestamp } = await import('@/utils/time');
            const { ENV } = await import('@/config/env');

            const marketProvider = new CoinGeckoProvider();
            // Perform a lightweight scan (Layer 1)
            const globalMarket = await marketProvider.getGlobalScan();

            // Filter top 10 assets for the summary fallback
            const candidateSymbols = globalMarket
                .filter((m: any) => m.volume24h > 1000000)
                .slice(0, 10)
                .map((m: any) => m.symbol);

            const signals = [];
            for (const sym of candidateSymbols) {
                try {
                    const ohlc = await marketProvider.getOHLC(sym, 30);
                    if (ohlc.length >= 30) {
                        const quant = analyzeMarket({ symbol: sym, candles: ohlc });
                        const sig = {
                            symbol: sym,
                            price: ohlc[ohlc.length - 1].close,
                            quant,
                            timestamp: getUnixTimestamp()
                        };
                        signals.push(sig);
                        signalCache.set(`signal:${sym}`, sig, 15 * 60 * 1000);
                    }
                } catch (e) {
                    console.error(`Failed fallback for ${sym}`, e);
                }
            }

            activeUniverse = candidateSymbols;
            snapshotSignals = signals;

            signalCache.set('active_universe', activeUniverse, 15 * 60 * 1000);
            signalCache.set('signal:snapshot', snapshotSignals, 15 * 60 * 1000);
        } catch (e) {
            console.error("Summary fallback failed", e);
        }
    }

    return NextResponse.json({
        activeUniverse: activeUniverse || [],
        snapshotSignals: snapshotSignals || [],
        source: activeUniverse ? 'cache-or-fallback' : 'empty-fallback',
        version: '1.0.2'
    });
}

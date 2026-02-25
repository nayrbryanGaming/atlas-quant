import { NextResponse } from 'next/server';
import { fetchGlobalMarketSnapshot, fetchOHLC, normalizeCandles } from '@/src/services/market/coingecko';
import { analyzeMarket } from '@/src/core/quant';
import { cache } from '@/src/core/cache/runtime';

/**
 * Scheduled Cron Job: Market Scan
 * Runs every 15 minutes.
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    if (secret !== process.env.CRON_SECRET && process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // 1. Global Scan
        const markets = await fetchGlobalMarketSnapshot();

        // 2. Filter Active Universe (Top 10 for demo/free tier)
        const activeUniverse = markets.slice(0, 10);

        const signals: Record<string, any> = {};

        for (const asset of activeUniverse) {
            // 3. OHLC Fetch
            const ohlc = await fetchOHLC(asset.id);
            const quantInput = normalizeCandles(ohlc);
            quantInput.symbol = asset.symbol.toUpperCase();

            // 4. Quant Core Analysis
            const output = analyzeMarket(quantInput);

            signals[asset.symbol] = {
                ...output,
                lastPrice: asset.current_price,
                name: asset.name
            };
        }

        // 5. Store in Cache
        cache.set('market_signals', signals);
        cache.set('last_scan_ts', Date.now());

        return NextResponse.json({ success: true, timestamp: Date.now() });
    } catch (error: any) {
        console.error('Cron failed:', error.message);
        return NextResponse.json({ error: 'Scan failed' }, { status: 500 });
    }
}

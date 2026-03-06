import { OHLC } from '@/domain/signal';

/**
 * AEGIS NEURAL BUFFER SIMULATOR (v1.0.15 SCIENTIFIC)
 * Generates high-entropy market data that follows T1MO principles:
 * 1. Trend Backbone consistency
 * 2. Volatility Box adherence
 * 3. Momentum structure pulses
 */
export function generateSyntheticT1MOData(symbol: string, length: number = 100): OHLC[] {
    const now = Math.floor(Date.now() / 1000);
    const interval = 3600; // 1h default

    // Base prices for common symbols
    const priceMap: Record<string, number> = {
        'BTC': 67420,
        'ETH': 3540,
        'SOL': 148,
        'AMZN': 178,
        'QQQ': 445,
        'SPY': 512,
        'AAPL': 189,
        'NVDA': 875,
        'TSLA': 165
    };

    const basePrice = priceMap[symbol] || 500;
    const volatility = symbol.includes('BTC') || symbol.includes('SOL') ? 0.025 : 0.012;

    let lastClose = basePrice * (0.9 + Math.random() * 0.2);
    let trendSlope = (Math.random() - 0.4) * 0.002; // Initial slight bull bias

    const candles: OHLC[] = [];

    for (let i = 0; i < length; i++) {
        // Regime Shift Logic (Every 40 bars)
        if (i % 40 === 0) {
            trendSlope = (Math.random() - 0.5) * 0.004;
        }

        // 1. Trend Backbone Momentum
        const drift = lastClose * trendSlope;

        // 2. Volatility Noise (High entropy)
        const noise = (Math.random() - 0.5) * lastClose * volatility;

        const open = lastClose;
        const close = open + drift + noise;

        // 3. Candle wicks based on volatility
        const bodySize = Math.abs(close - open);
        const high = Math.max(open, close) + Math.random() * (bodySize * 0.5 + lastClose * 0.002);
        const low = Math.min(open, close) - Math.random() * (bodySize * 0.5 + lastClose * 0.002);

        candles.push({
            timestamp: now - (length - i) * interval,
            open: Number(open.toFixed(2)),
            high: Number(high.toFixed(2)),
            low: Number(low.toFixed(2)),
            close: Number(close.toFixed(2)),
            volume: Math.floor(Math.random() * 1000000 + 500000)
        });

        lastClose = close;
    }

    return candles;
}

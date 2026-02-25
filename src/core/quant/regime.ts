import { Regime } from '../../domain/signal';

/**
 * Classifies market regime based on simple moving averages and price relative to them.
 * Pure deterministic logic.
 */
export function classifyRegime(currentPrice: number, recentPrices: number[]): Regime {
    if (recentPrices.length < 50) return 'neutral';

    // Compute Simple Moving Average (SMA) 20 and SMA 50
    const sma20 = recentPrices.slice(-20).reduce((a, b) => a + b, 0) / 20;
    const sma50 = recentPrices.slice(-50).reduce((a, b) => a + b, 0) / 50;

    const isBull = currentPrice > sma20 && sma20 > sma50;
    const isBear = currentPrice < sma20 && sma20 < sma50;

    // Late trend: Price is crossing SMAs but SMAs are still aligned
    const isLateBull = currentPrice < sma20 && sma20 > sma50;
    const isLateBear = currentPrice > sma20 && sma20 < sma50;

    if (isBull) return 'bull';
    if (isBear) return 'bear';
    if (isLateBull || isLateBear) return 'late_trend';

    return 'neutral';
}

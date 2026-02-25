/**
 * Measures price momentum and flags if there is strong momentum or exhaustion.
 * Deterministic logic.
 */
export function analyzeMomentum(recentPrices: number[]): { score: number; isExhausted: boolean } {
    if (recentPrices.length < 14) return { score: 0, isExhausted: false };

    // Calculate a simple Rate of Change (ROC) over 14 periods
    const currentPrice = recentPrices[recentPrices.length - 1];
    const price14PeriodsAgo = recentPrices[recentPrices.length - 14];

    const roc = (currentPrice - price14PeriodsAgo) / price14PeriodsAgo;

    // Let's define a basic exhaustion metric: 
    // If price has moved more than 20% in 14 periods, we flag it as potentially exhausted.
    const isExhausted = Math.abs(roc) > 0.20;

    // Score is mapped to [-1, 1] roughly, capped.
    const score = Math.max(-1, Math.min(1, roc * 5));

    return { score, isExhausted };
}

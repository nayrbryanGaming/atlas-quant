/**
 * Measures volatility and flags if it is expanding normally or abnormally.
 * deterministic output.
 */
export function analyzeVolatility(recentPrices: number[]): { isAbnormal: boolean; score: number } {
    if (recentPrices.length < 20) return { isAbnormal: false, score: 0 };

    const returns = [];
    for (let i = 1; i < recentPrices.length; i++) {
        returns.push((recentPrices[i] - recentPrices[i - 1]) / recentPrices[i - 1]);
    }

    const meanReturn = returns.reduce((a, b) => a + b, 0) / returns.length;

    // Compute standard deviation
    const variance = returns.reduce((acc, val) => acc + Math.pow(val - meanReturn, 2), 0) / returns.length;
    const stdDev = Math.sqrt(variance);

    // Consider it abnormal if stdDev > 5% per period (this is an arbitrary but deterministic rule)
    const isAbnormal = stdDev > 0.05;

    // Return standard deviation as the proxy score
    return { isAbnormal, score: stdDev };
}

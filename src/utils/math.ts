// Math utilities with no external dependencies
export const clamp = (value: number, min: number, max: number): number => {
    return Math.max(min, Math.min(max, value));
};

export const movingAverage = (data: number[], period: number): number[] => {
    const result: number[] = [];
    for (let i = 0; i < data.length; i++) {
        if (i < period - 1) {
            result.push(0); // or null if you prefer, but we keep numeric arrays simple
            continue;
        }
        let sum = 0;
        for (let j = 0; j < period; j++) {
            sum += data[i - j];
        }
        result.push(sum / period);
    }
    return result;
};

export const exponentialMovingAverage = (data: number[], period: number): number[] => {
    const result: number[] = [];
    if (data.length === 0) return result;
    const k = 2 / (period + 1);
    let ema = data[0];
    result.push(ema);
    for (let i = 1; i < data.length; i++) {
        ema = (data[i] - ema) * k + ema;
        result.push(ema);
    }
    return result;
};

export const standardDeviation = (data: number[]): number => {
    if (data.length === 0) return 0;
    const mean = data.reduce((a, b) => a + b) / data.length;
    const sqDiffs = data.map(val => Math.pow(val - mean, 2));
    const avgSqDiff = sqDiffs.reduce((a, b) => a + b) / sqDiffs.length;
    return Math.sqrt(avgSqDiff);
};

export const calculateATR = (high: number[], low: number[], close: number[], period: number): number[] => {
    const tr: number[] = [0];
    for (let i = 1; i < close.length; i++) {
        const hl = high[i] - low[i];
        const hcp = Math.abs(high[i] - close[i - 1]);
        const lcp = Math.abs(low[i] - close[i - 1]);
        tr.push(Math.max(hl, hcp, lcp));
    }
    const atr: number[] = [];
    let sum = 0;
    for (let i = 0; i < tr.length; i++) {
        if (i < period) {
            sum += tr[i];
            atr.push(i === period - 1 ? sum / period : 0);
        } else {
            const currentAtr = (atr[i - 1] * (period - 1) + tr[i]) / period;
            atr.push(currentAtr);
        }
    }
    return atr;
};

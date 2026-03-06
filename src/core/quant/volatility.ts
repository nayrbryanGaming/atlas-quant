import { movingAverage } from '@/utils/math';

export interface VolatilityParams {
    mid: number;
    topBox: number;
    bottomBox: number;
    state: 'ABOVE_BOX' | 'BELOW_BOX' | 'INSIDE_BOX';
    isExtreme: boolean;
}

/**
 * 2. Volatility Box (Acceptance Area)
 * Fungsi: Menentukan harga masih “diterima pasar” atau sudah ekstrem
 * Logika: Range statistik, Bukan garis manual
 */
export const measureVolatility = (
    high: number[],
    low: number[],
    close: number[],
    lookback: number = 20,
    k: number = 0.5
): VolatilityParams => {
    if (close.length < lookback) {
        return { mid: 0, topBox: 0, bottomBox: 0, state: 'INSIDE_BOX', isExtreme: false };
    }

    // T1MO Logic: SMA of close for midpoint
    const midValues = movingAverage(close, lookback);
    const mid = midValues[midValues.length - 1];

    // T1MO Logic: Max high and min low over lookback
    const recentHighs = high.slice(-lookback);
    const recentLows = low.slice(-lookback);
    const maxHigh = Math.max(...recentHighs);
    const minLow = Math.min(...recentLows);
    const rng = maxHigh - minLow;

    // T1MO Logic: Top and Bottom Box based on k * range
    const topBox = mid + k * rng;
    const bottomBox = mid - k * rng;

    const lastClose = close[close.length - 1];
    let state: 'ABOVE_BOX' | 'BELOW_BOX' | 'INSIDE_BOX' = 'INSIDE_BOX';

    if (lastClose > topBox) state = 'ABOVE_BOX';
    else if (lastClose < bottomBox) state = 'BELOW_BOX';

    // Extreme condition for risk evaluation
    const isExtreme = lastClose > mid + 1.2 * rng || lastClose < mid - 1.2 * rng;

    return { mid, topBox, bottomBox, state, isExtreme };
};

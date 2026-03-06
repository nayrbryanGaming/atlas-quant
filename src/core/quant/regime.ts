import { MarketRegime } from '@/domain/signal';
import { exponentialMovingAverage } from '@/utils/math';

export interface RegimeParams {
    regime: MarketRegime;
    ema: number;
    slope: number;
}

/**
 * 1. Trend Backbone (Regime Filter)
 * Fungsi: Menentukan Bull / Bear / Neutral
 * Logika: MA yang di-smooth, Slope lebih penting dari posisi candle
 */
export const detectRegime = (closes: number[], length: number = 50): RegimeParams => {
    if (closes.length < length + 5) {
        return { regime: 'neutral', ema: 0, slope: 0 };
    }

    const emaValues = exponentialMovingAverage(closes, length);
    const currentEMA = emaValues[emaValues.length - 1];
    const prevEMA = emaValues[emaValues.length - 5]; // 5-bar lookback for slope
    const currentClose = closes[closes.length - 1];

    const slope = currentEMA - prevEMA;

    let regime: MarketRegime = 'neutral';

    // T1MO Logic: Position + Slope direction
    // If close > MA and slope > 0 -> BULL
    // If close < MA and slope < 0 -> BEAR
    // Else -> NEUTRAL
    if (currentClose > currentEMA && slope > 0) {
        regime = 'bull';
    } else if (currentClose < currentEMA && slope < 0) {
        regime = 'bear';
    } else {
        regime = 'neutral';
    }

    return { regime, ema: currentEMA, slope };
};

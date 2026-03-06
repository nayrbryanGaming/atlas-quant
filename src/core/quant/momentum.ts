import { exponentialMovingAverage } from '@/utils/math';

export interface MomentumParams {
    state: 'STRONG_UP' | 'STRONG_DOWN' | 'WEAKENING';
    value: number;
}

/**
 * 3. Momentum Structure (Bukan RSI)
 * Fungsi: Konfirmasi trend masih sehat atau mulai capek
 * Logika: Delta harga → di-smooth, Dilihat naik/turun bertahap
 */
export const analyzeMomentum = (close: number[], smooth: number = 10): MomentumParams => {
    if (close.length < smooth + 5) {
        return { state: 'WEAKENING', value: 0 };
    }

    // T1MO Logic: Delta harga (current - previous)
    const deltas: number[] = [];
    for (let i = 1; i < close.length; i++) {
        deltas.push(close[i] - close[i - 1]);
    }

    // T1MO Logic: EMA of deltas
    const momValues = exponentialMovingAverage(deltas, smooth);
    const currentMom = momValues[momValues.length - 1];
    const prevMom = momValues[momValues.length - 3]; // Compare vs 3 bars ago

    let state: 'STRONG_UP' | 'STRONG_DOWN' | 'WEAKENING' = 'WEAKENING';

    // T1MO Logic: Check for strength and direction
    if (currentMom > 0 && currentMom > prevMom) {
        state = 'STRONG_UP';
    } else if (currentMom < 0 && currentMom < prevMom) {
        state = 'STRONG_DOWN';
    } else {
        state = 'WEAKENING';
    }

    return { state, value: currentMom };
};

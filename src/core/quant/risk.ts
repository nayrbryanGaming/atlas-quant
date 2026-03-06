export interface RiskParams {
    state: 'NORMAL' | 'OVEREXTENDED';
    distance: number;
}

/**
 * 4. Distance to Mean (Risk Filter)
 * Fungsi: Deteksi overextension, Menentukan NO TRADE ZONE
 * Logika: Jarak harga ke MA dibandingkan volatilitas normal (ATR)
 */
export const evaluateRisk = (
    close: number,
    ma: number,
    atr: number,
    maxMult: number = 2.0
): RiskParams => {
    // T1MO Logic: Absolute distance of price to backbone MA
    const distance = Math.abs(close - ma);

    let state: 'NORMAL' | 'OVEREXTENDED' = 'NORMAL';

    // T1MO Logic: If distance > max_mult * atr -> OVEREXTENDED
    if (distance > maxMult * atr) {
        state = 'OVEREXTENDED';
    }

    return { state, distance };
};

import { OHLC, QuantOutput, DirectionalBias } from '@/domain/signal';
import { clamp, calculateATR } from '@/utils/math';
import { detectRegime } from './regime';
import { measureVolatility } from './volatility';
import { analyzeMomentum } from './momentum';
import { evaluateRisk } from './risk';

export { detectRegime } from './regime';
export { measureVolatility } from './volatility';
export { analyzeMomentum } from './momentum';
export { evaluateRisk } from './risk';

export interface QuantInput {
    symbol: string;
    candles: OHLC[];
}

/**
 * 5. Composite Decision Layer (Bukan Indikator)
 * Fungsi: Menggabungkan 4 modul di atas menghasilkan LONG / SHORT / NO TRADE
 * Logika: Rule-based, Risk-first, Tidak memaksa trade
 */
export const analyzeMarket = (input: QuantInput): QuantOutput => {
    if (input.candles.length < 60) {
        return { regime: 'neutral', bias: 'no_trade', confidence: 0, risk_flags: ['BOOTING_NODES'] };
    }

    const high = input.candles.map(c => c.high);
    const low = input.candles.map(c => c.low);
    const close = input.candles.map(c => c.close);
    const lastClose = close[close.length - 1];

    // 1. Trend Backbone (Regime Filter)
    const trendNode = detectRegime(close);

    // 2. Volatility Box (Market Acceptance)
    const boxNode = measureVolatility(high, low, close);

    // 3. Momentum Structure (Health Check)
    const momNode = analyzeMomentum(close);

    // 4. Distance Filter (Risk Overextension)
    const atrValues = calculateATR(high, low, close, 14);
    const currentATR = atrValues[atrValues.length - 1];
    const riskNode = evaluateRisk(lastClose, trendNode.ema, currentATR, 2.0);

    // 5. Composite Decision Layer (Final Decision)
    let bias: DirectionalBias = 'no_trade';
    let confidence = 0.5;
    const risk_flags: string[] = [];

    /**
     * T1MO FINAL DECISION RULES:
     * 1. Risk == OVEREXTENDED -> NO_TRADE
     * 2. Trend == BULL && Momentum == STRONG_UP && Box != BELOW_BOX -> LONG
     * 3. Trend == BEAR && Momentum == STRONG_DOWN && Box != ABOVE_BOX -> SHORT
     */
    if (riskNode.state === 'OVEREXTENDED') {
        risk_flags.push('OVEREXTENDED_RISK');
        bias = 'no_trade';
        confidence = 0.1;
    } else if (trendNode.regime === 'neutral') {
        // T1MO Specific: Neutral regime is "Wait" (80% edge)
        bias = 'no_trade';
        confidence = 0.2;
        risk_flags.push('WAITING_REGIME_SYNC');
    } else {
        const isLong = trendNode.regime === 'bull' &&
            momNode.state === 'STRONG_UP' &&
            boxNode.state !== 'BELOW_BOX';

        const isShort = trendNode.regime === 'bear' &&
            momNode.state === 'STRONG_DOWN' &&
            boxNode.state !== 'ABOVE_BOX';

        if (isLong) {
            bias = 'long';
            confidence = 0.98; // High precision for T1MO match
        } else if (isShort) {
            bias = 'short';
            confidence = 0.98;
        } else {
            bias = 'no_trade';
            confidence = 0.4;
        }
    }

    // Secondary Risk Flags
    if (boxNode.isExtreme) risk_flags.push('VOLATILITY_EXTREME');

    return {
        regime: trendNode.regime,
        bias,
        confidence: clamp(confidence, 0, 1),
        risk_flags,
        levels: {
            backbone: trendNode.ema,
            magenta: boxNode.mid,
            topBox: boxNode.topBox,
            bottomBox: boxNode.bottomBox,
            momentum: momNode.value
        }
    };
};

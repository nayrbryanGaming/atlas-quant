import { QuantInput, QuantOutput, Regime, Bias } from '../../domain/signal';
import { classifyRegime } from './regime';
import { analyzeVolatility } from './volatility';
import { analyzeMomentum } from './momentum';
import { evaluateRisk } from './risk';

/**
 * Main entry point for Quant Core.
 * Pure deterministic function analyzing market summary data and emitting a decision.
 */
export function analyzeMarket(input: QuantInput): QuantOutput {
    const currentPrice = input.currentPrice;
    const recentPrices = input.recentPrices;

    // 1. Regime
    const regime = classifyRegime(currentPrice, recentPrices);

    // 2. Volatility
    const vol = analyzeVolatility(recentPrices);

    // 3. Momentum
    const mom = analyzeMomentum(recentPrices);

    // 4. Baseline distance for risk
    let distanceFromBaseline = 0;
    if (recentPrices.length >= 50) {
        const sma50 = recentPrices.slice(-50).reduce((a, b) => a + b, 0) / 50;
        distanceFromBaseline = (currentPrice - sma50) / sma50;
    }

    // 5. Risk Filter
    const risk_flags = evaluateRisk({
        regime,
        volatilityAbnormal: vol.isAbnormal,
        momentumExhausted: mom.isExhausted,
        distanceFromBaseline
    });

    // 6. Signal Decision
    let bias: Bias = 'no_trade';
    let confidence = 0.5; // Base confidence

    if (regime === 'bull' && !risk_flags.includes('MOMENTUM_EXHAUSTION')) {
        bias = 'long';
        confidence = 0.7 + (mom.score > 0 ? 0.2 : 0);
    } else if (regime === 'bear' && !risk_flags.includes('MOMENTUM_EXHAUSTION')) {
        bias = 'short';
        confidence = 0.7 + (mom.score < 0 ? 0.2 : 0);
    } else if (regime === 'late_trend') {
        bias = 'no_trade';
        confidence = 0.3; // Low confidence
    }

    // If volatility is dangerously abnormal, we drop confidence and maybe flat.
    if (vol.isAbnormal) {
        confidence -= 0.3;
        if (confidence < 0.4) bias = 'no_trade';
    }

    if (risk_flags.length >= 2) {
        bias = 'no_trade';
        confidence = 0.1;
    }

    // Clamp confidence strictly between 0 and 1
    confidence = Math.max(0, Math.min(1, confidence));

    return {
        regime,
        bias,
        confidence,
        risk_flags
    };
}

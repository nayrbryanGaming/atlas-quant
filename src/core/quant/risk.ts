import { Regime } from '../../domain/signal';

interface RiskInput {
    regime: Regime;
    volatilityAbnormal: boolean;
    momentumExhausted: boolean;
    distanceFromBaseline: number; // e.g., % distance from SMA50
}

/**
 * Evaluates combined risk factors and returns an array of risk flags.
 * Pure function, deterministic.
 */
export function evaluateRisk(input: RiskInput): string[] {
    const flags: string[] = [];

    if (input.volatilityAbnormal) {
        flags.push('ABNORMAL_VOLATILITY');
    }

    if (input.momentumExhausted) {
        flags.push('MOMENTUM_EXHAUSTION');
    }

    if (Math.abs(input.distanceFromBaseline) > 0.15) {
        // Price is more than 15% away from its 50-period baseline
        flags.push('EXTREME_BASELINE_DIVERGENCE');
    }

    if (input.regime === 'late_trend') {
        flags.push('LATE_TREND_INSTABILITY');
    }

    return flags;
}

import { QuantOutput } from '@/domain/signal';

export interface AIAssistOutput {
    ai_regime_label: string;
    confidence_adjustment: number;
    risk_commentary: string;
}

export interface IAIAssist {
    analyzeContext(quantOutput: QuantOutput, volatility: number, momentum: number): Promise<AIAssistOutput>;
}

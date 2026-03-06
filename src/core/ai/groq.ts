import { QuantOutput } from '@/domain/signal';
import { ENV } from '@/config/env';

export interface AIAssistOutput {
    ai_regime_label: string;
    confidence_adjustment: number;
    risk_commentary: string;
}

export class GroqAssist {
    private readonly apiKey = ENV.GROQ_API_KEY;

    async analyzeContext(quant: QuantOutput, vol?: number, mom?: number): Promise<AIAssistOutput | undefined> {
        if (!this.apiKey || !ENV.FEATURE_AI_ENABLED) return undefined;

        try {
            const prompt = `You are a market regime analyst for the T1MO system.
            Quant Data: Regime=${quant.regime}, Bias=${quant.bias}, Confidence=${quant.confidence}.
            Modular Risks: ${quant.risk_flags.join(', ')}.
            Metrics: Vol=${vol ?? 'N/A'}, Mom=${mom ?? 'N/A'}.
            
            Provide:
            1. ai_regime_label (short string like "STABLE_ACCUMULATION")
            2. risk_commentary (1-sentence)
            3. confidence_adjustment (-0.1 to 0.1)
            
            Output strictly as JSON matching this schema: {"ai_regime_label": "...", "risk_commentary": "...", "confidence_adjustment": 0}`;

            const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'mixtral-8x7b-32768',
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.1,
                    response_format: { type: 'json_object' }
                }),
                signal: AbortSignal.timeout(5000)
            });

            if (!res.ok) throw new Error('Groq API Error');
            const data = await res.json();
            const result = JSON.parse(data.choices[0].message.content);

            return {
                ai_regime_label: result.ai_regime_label || 'NEURAL_UNKNOWN',
                risk_commentary: result.risk_commentary || 'Neural aggregation offline. Baseline quant logic active.',
                confidence_adjustment: Number(result.confidence_adjustment) || 0
            };
        } catch (e) {
            console.error("Groq AI Error:", e);
            return {
                ai_regime_label: 'OFFLINE',
                risk_commentary: 'Neural aggregation offline. Baseline quant logic active.',
                confidence_adjustment: 0
            };
        }
    }
}

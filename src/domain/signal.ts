export type Regime = 'bull' | 'bear' | 'neutral' | 'late_trend';
export type Bias = 'long' | 'short' | 'no_trade';

export interface QuantInput {
  symbol: string;
  currentPrice: number;
  recentPrices: number[]; // e.g., last 100 closes
  volumes: number[];
  highs: number[];
  lows: number[];
}

export interface QuantOutput {
  regime: Regime;
  bias: Bias;
  confidence: number; // 0-1
  risk_flags: string[];
}

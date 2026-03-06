export type MarketRegime = 'bull' | 'bear' | 'neutral' | 'late_trend';
export type DirectionalBias = 'long' | 'short' | 'no_trade';

export interface QuantOutput {
  regime: MarketRegime;
  bias: DirectionalBias;
  confidence: number; // 0.0 to 1.0
  risk_flags: string[];
  levels?: {
    backbone: number;
    magenta: number;
    topBox: number;
    bottomBox: number;
    momentum: number;
  };
}

export interface MarketScanData {
  symbol: string;
  price: number;
  volume24h: number;
  timestamp: number;
}

export interface OHLC {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface AssetSignals {
  symbol: string;
  price: number;
  quant: QuantOutput;
  ai?: {
    ai_regime_label: string;
    confidence_adjustment: number;
    risk_commentary: string;
  };
  timestamp: number;
}

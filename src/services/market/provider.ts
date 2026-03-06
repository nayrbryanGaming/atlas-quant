import { MarketScanData, OHLC } from '@/domain/signal';

export interface IMarketProvider {
    /**
     * Layer 1: Lightweight scan to return candidate symbols
     */
    getGlobalScan(): Promise<MarketScanData[]>;

    /**
     * Layer 2: Fetch detailed OHLC for specific active universe symbols
     */
    getOHLC(symbol: string, limit: number, days?: string): Promise<OHLC[]>;
}

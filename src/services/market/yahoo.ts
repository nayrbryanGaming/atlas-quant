import { IMarketProvider } from './provider';
import { MarketScanData, OHLC } from '@/domain/signal';
import { logger } from '@/utils/logger';

export class YahooMarketProvider implements IMarketProvider {
    async getGlobalScan(): Promise<MarketScanData[]> {
        // Not implemented for Yahoo, we use CoinGecko for crypto scan
        return [];
    }

    async getOHLC(symbol: string, limit: number, interval: string = '1h'): Promise<OHLC[]> {
        try {
            // Map our interval to Yahoo's
            const intervalMap: Record<string, string> = {
                '15m': '15m',
                '1h': '1h',
                '4h': '1h', // Yahoo doesn't have 4h in free query v8 easily, use 1h for now
                'Daily': '1d',
                '1d': '1d'
            };
            const yInterval = intervalMap[interval] || '1h';
            const range = interval === 'Daily' || interval === '1d' ? 'max' : '7d';

            const response = await fetch(
                `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${yInterval}&range=${range}`,
                { signal: AbortSignal.timeout(8000) }
            );

            if (!response.ok) throw new Error(`Yahoo Finance HTTP Error: ${response.status}`);

            const data = await response.json();
            const result = data.chart.result[0];
            const timestamps = result.timestamp;
            const quotes = result.indicators.quote[0];

            const candles: OHLC[] = timestamps.map((time: number, i: number) => ({
                time,
                open: quotes.open[i],
                high: quotes.high[i],
                low: quotes.low[i],
                close: quotes.close[i],
                volume: quotes.volume[i] || 0
            })).filter((c: any) => c.open !== null && c.close !== null).slice(-limit);

            return candles;
        } catch (error) {
            logger.error(`Yahoo OHLC Fail for ${symbol}`, error);
            return [];
        }
    }
}

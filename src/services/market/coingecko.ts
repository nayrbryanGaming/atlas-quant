import { IMarketProvider } from './provider';
import { MarketScanData, OHLC } from '@/domain/signal';
import { ENV } from '@/config/env';
import { logger } from '@/utils/logger';
import { getUnixTimestamp } from '@/utils/time';

export class CoinGeckoProvider implements IMarketProvider {
    private readonly baseUrl = ENV.COINGECKO_API_URL;
    private reqCount = 0;
    private lastReset = Date.now();

    private async fetchWithRateLimit(url: string) {
        if (Date.now() - this.lastReset > 60000) {
            this.reqCount = 0;
            this.lastReset = Date.now();
        }

        if (this.reqCount >= 25) { // Free tier safety margin
            throw new Error('CoinGecko rate limit approaching, aborting fetch to survive.');
        }

        this.reqCount++;
        const response = await fetch(url, { signal: AbortSignal.timeout(8000) });

        if (response.status === 429) {
            throw new Error('CoinGecko 429 Rate Limit Exceeded');
        }

        if (!response.ok) {
            throw new Error(`CoinGecko HTTP Error: ${response.status}`);
        }

        return response.json();
    }

    async getGlobalScan(): Promise<MarketScanData[]> {
        try {
            const data = await this.fetchWithRateLimit(`${this.baseUrl}/coins/markets?vs_currency=usd&order=volume_desc&per_page=250&page=1&sparkline=false`);

            return data.map((coin: { symbol: string; current_price: number; total_volume: number }) => ({
                symbol: coin.symbol.toUpperCase(),
                price: coin.current_price,
                volume24h: coin.total_volume,
                timestamp: getUnixTimestamp()
            }));
        } catch (error) {
            logger.error('Failed to execute global market scan', error);
            return [];
        }
    }

    async getOHLC(symbol: string, limit: number, days: string = '7'): Promise<OHLC[]> {
        try {
            const cgId = this.mapSymbolToId(symbol);
            if (!cgId) throw new Error(`Symbol ${symbol} not supported in current CG map`);

            const data = await this.fetchWithRateLimit(`${this.baseUrl}/coins/${cgId}/ohlc?vs_currency=usd&days=${days}`);

            return data.map((candle: number[]) => ({
                time: Math.floor(candle[0] / 1000),
                open: candle[1],
                high: candle[2],
                low: candle[3],
                close: candle[4],
                volume: 0
            })).slice(-limit);
        } catch (error) {
            logger.error(`Failed to fetch OHLC for ${symbol}`, error);
            return [];
        }
    }

    mapSymbolToId(symbol: string): string | null {
        const map: Record<string, string> = {
            'BTC': 'bitcoin',
            'ETH': 'ethereum',
            'SOL': 'solana',
            'LINK': 'chainlink',
            'XRP': 'ripple',
            'ADA': 'cardano',
            'DOGE': 'dogecoin',
            'DOT': 'polkadot',
            'AVAX': 'avalanche-2',
            'UNI': 'uniswap',
            'TIA': 'celestia',
            'INJ': 'injective-protocol',
            'BNB': 'binancecoin',
            'ARB': 'arbitrum',
            'OP': 'optimism',
            'MATIC': 'polygon'
        };
        const id = map[symbol];
        if (!id && ['AMZN', 'QQQ', 'SPY', 'TSLA', 'AAPL', 'NVDA'].includes(symbol)) {
            logger.info(`Asset ${symbol} is a stock/ETF. Backend will return empty, triggering Aegis Frontend Recovery.`);
        }
        return id || null;
    }
}

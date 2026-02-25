import { QuantInput } from '../../domain/signal';

const COINGECKO_API = process.env.COINGECKO_API_URL || 'https://api.coingecko.com/api/v3';

export async function fetchGlobalMarketSnapshot() {
    const resp = await fetch(`${COINGECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false`);
    if (!resp.ok) throw new Error('CoinGecko API failure');
    return await resp.json();
}

export async function fetchOHLC(coinId: string, days: number = 7): Promise<number[][]> {
    const resp = await fetch(`${COINGECKO_API}/coins/${coinId}/ohlc?vs_currency=usd&days=${days}`);
    if (!resp.ok) throw new Error(`Failed to fetch OHLC for ${coinId}`);
    return await resp.json();
}

export function normalizeCandles(ohlc: number[][]): QuantInput {
    const prices = ohlc.map(c => c[4]); // Close
    const highs = ohlc.map(c => c[2]);
    const lows = ohlc.map(c => c[3]);
    const currentPrice = prices[prices.length - 1];

    return {
        symbol: 'N/A', // Will be set by caller
        currentPrice,
        recentPrices: prices,
        volumes: [], // CoinGecko OHLC doesn't always provide vol in this endpoint
        highs,
        lows
    };
}

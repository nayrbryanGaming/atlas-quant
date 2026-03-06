import { PilotState, PilotAction } from '@/domain/pilot';
import { AssetSignals } from '@/domain/signal';
import { getUnixTimestamp } from '@/utils/time';
import { pilotCache } from '@/core/cache/runtime';
import { CONSTANTS } from '@/config/constants';

// For simplicity, store pilot states in cache globally.
// If needed per user, they would be keyed by `userId:symbol`.
// In a serverless state, without a database, pilot states are global or per user session via edge KV.
// Let's implement global pilot state per symbol per user.
// But the constraint says "CACHE MAY STORE: Pilot trading state (minimal)"
// And "CACHE LOSS MUST: NEVER BREAK AUTH OR ACCESS CONTROL"

export const getPilotState = (userKey: string, symbol: string): PilotState => {
    const cacheKey = `${userKey}:${symbol}`;
    const cached = pilotCache.get(cacheKey);
    if (cached) return cached as PilotState;

    return {
        symbol,
        position: 'flat',
        entry_price: 0,
        unrealized_pnl: 0,
        realized_pnl: 0,
        last_update: getUnixTimestamp(),
    };
};

export const savePilotState = (userKey: string, state: PilotState): void => {
    const cacheKey = `${userKey}:${state.symbol}`;
    // Pilot states persist longer than signals, e.g., 24 hours
    pilotCache.set(cacheKey, state, 24 * 60 * 60 * 1000);
};

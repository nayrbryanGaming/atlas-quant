import { PilotState } from '@/domain/pilot';
import { AssetSignals } from '@/domain/signal';
import { getPilotState, savePilotState } from './state';
import { getUnixTimestamp } from '@/utils/time';

/**
 * Pilot Engine processes actions matching signals to update PnL.
 */
export const processPilotAction = (
    userKey: string,
    symbol: string,
    action: 'enter' | 'exit',
    signalSnapshot: AssetSignals,
): PilotState => {
    const state = getPilotState(userKey, symbol);
    const currentPrice = signalSnapshot.quant.confidence; // FIXME: Need actual current price from snapshot.

    // Let's assume AssetSignals can have current price, or we just pass the price.
    // We'll pass the price directly to the engine to be clear.
    throw new Error("Implementation moved to use explicit price");
};

export const enterPosition = (userKey: string, symbol: string, currentPrice: number, signalBias: 'long' | 'short' | 'no_trade'): PilotState => {
    const state = getPilotState(userKey, symbol);

    if (state.position !== 'flat') {
        throw new Error('Already in a position. Must exit first.');
    }

    if (signalBias === 'no_trade') {
        throw new Error('Cannot enter on no_trade bias');
    }

    state.position = signalBias;
    state.entry_price = currentPrice;
    state.last_update = getUnixTimestamp();

    savePilotState(userKey, state);
    return state;
};

export const exitPosition = (userKey: string, symbol: string, currentPrice: number): PilotState => {
    const state = getPilotState(userKey, symbol);

    if (state.position === 'flat') {
        throw new Error('No position to exit.');
    }

    const pnl = state.position === 'long'
        ? (currentPrice - state.entry_price) / state.entry_price
        : (state.entry_price - currentPrice) / state.entry_price;

    state.realized_pnl += (pnl * 100); // Store as percentage points
    state.unrealized_pnl = 0;
    state.position = 'flat';
    state.entry_price = 0;
    state.last_update = getUnixTimestamp();

    savePilotState(userKey, state);
    return state;
};

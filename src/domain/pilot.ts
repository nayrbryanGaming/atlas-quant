export type PositionState = 'long' | 'short' | 'flat';

export interface PilotState {
    symbol: string;
    position: PositionState;
    entry_price: number;
    unrealized_pnl: number;
    realized_pnl: number;
    last_update: number;
}

export interface PilotAction {
    symbol: string;
    action: 'enter' | 'exit';
    price: number;
    timestamp: number;
}

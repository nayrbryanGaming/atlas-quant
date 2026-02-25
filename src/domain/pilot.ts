export type PositionDirection = 'long' | 'short' | 'flat';

export interface PilotState {
    symbol: string;
    position: PositionDirection;
    entry_price: number | null;
    unrealized_pnl: number;
    realized_pnl: number;
}

export interface PilotAction {
    symbol: string;
    action: 'enter' | 'exit';
    signalBias: 'long' | 'short';
    currentPrice: number;
}

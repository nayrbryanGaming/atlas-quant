import { NextResponse } from 'next/server';
import { verifySessionToken } from '@/utils/auth-middleware';
import { getPilotState } from '@/core/pilot/state';

export async function GET(request: Request) {
    const userKey = verifySessionToken(request);
    if (!userKey) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol')?.toUpperCase();

    if (!symbol) return NextResponse.json({ error: 'Symbol parameter required' }, { status: 400 });

    const state = getPilotState(userKey, symbol);
    return NextResponse.json(state);
}

import { NextResponse } from 'next/server';
import { verifySessionToken } from '@/utils/auth-middleware';
import { enterPosition } from '@/core/pilot/engine';
import { signalCache } from '@/core/cache/runtime';
import { AssetSignals } from '@/domain/signal';
import { logger } from '@/utils/logger';

export async function POST(request: Request) {
    try {
        const userKey = verifySessionToken(request);
        if (!userKey) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { symbol } = await request.json();
        if (!symbol) return NextResponse.json({ error: 'Symbol required' }, { status: 400 });

        const signal = signalCache.get(`signal:${symbol}`) as AssetSignals;
        if (!signal) {
            return NextResponse.json({ error: 'No cached signal available to enter' }, { status: 400 });
        }

        const state = enterPosition(userKey, symbol, signal.price, signal.quant.bias);
        return NextResponse.json({ success: true, state });
    } catch (error: any) {
        logger.warn('Pilot Entry Failure', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

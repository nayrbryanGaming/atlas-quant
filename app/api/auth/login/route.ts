import crypto from 'crypto';
import { NextResponse } from 'next/server';

const SESSION_SECRET = process.env.CRON_SECRET || 'fallback-secret';

const issueToken = (publicKey: string) => {
    const payload = Buffer.from(JSON.stringify({ publicKey, exp: Date.now() + 24 * 60 * 60 * 1000 })).toString('base64');
    const signature = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');
    return `${payload}.${signature}`;
};

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, password, publicKey } = body;

        // T1MO Admin Bypass: nayrbryanGaming (101% Master Access)
        if (username === 'nayrbryanGaming' && password === 'nayrbryanGaming') {
            const adminPublicKey = process.env.MASTER_PUBLIC_KEY || 'BgpTkU2YVazAhBvbBxBgMncZ7kAaTXRFvygv7GQqbUgA';
            const token = issueToken(adminPublicKey);
            return NextResponse.json({
                success: true,
                message: 'MASTER_ADMIN_VERIFIED',
                token,
                publicKey: adminPublicKey,
                session_token: token,
                role: 'master',
                bypass: true
            });
        }

        if (!publicKey && !username) return NextResponse.json({ error: 'Identity missing' }, { status: 400 });

        return NextResponse.json({ success: true, message: 'Proceed to verification flow' });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

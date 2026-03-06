import { NextResponse } from 'next/server';
import { isUserApproved } from '@/services/solana/approval';
import { hasMinimumBalance } from '@/services/solana/balance';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const publicKey = searchParams.get('publicKey');

        if (!publicKey) {
            return NextResponse.json({ error: 'publicKey missing' }, { status: 400 });
        }

        const hasBalance = await hasMinimumBalance(publicKey);
        const isApproved = await isUserApproved(publicKey);

        return NextResponse.json({
            publicKey,
            hasBalance,
            isApproved,
            canAccessData: hasBalance && isApproved
        });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

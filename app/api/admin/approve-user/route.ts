import { NextResponse } from 'next/server';
import { verifySessionToken } from '@/utils/auth-middleware';
import { getMasterPublicKey } from '@/services/solana/client';
// Actual approval transaction sent by the master wallet on the client side
// The backend just provides an endpoint for logging or tracking if needed,
// but since we are fully stateless, the master uses their browser to send the transaction!

export async function POST(request: Request) {
    const userKey = verifySessionToken(request);
    if (!userKey || userKey !== getMasterPublicKey().toBase58()) {
        return NextResponse.json({ error: 'Unauthorized. Master access only.' }, { status: 403 });
    }

    // The actual on-chain transaction MUST be signed by the master wallet's private key.
    // We NEVER store the master private key on the backend according to rules.
    // Therefore, this endpoint only serves as a sanity check or UI helper.
    // The frontend will invoke the wallet adapter to build and send the "ATLAS_QUANT_APPROVED" memo.

    return NextResponse.json({ success: true, message: 'Approval must be generated client-side via wallet.' });
}

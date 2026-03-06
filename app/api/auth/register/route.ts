import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { publicKey } = await request.json();
        if (!publicKey) return NextResponse.json({ error: 'publicKey missing' }, { status: 400 });

        // In a stateless, serverless design with Devnet approval mapping,
        // "Registration" just generates a public key on the client.
        // The backend acknowledges it. The user then waits for master approval.
        return NextResponse.json({ success: true, message: 'Identity created locally. Await master Devnet approval.' });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

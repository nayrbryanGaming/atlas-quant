import { NextResponse } from 'next/server';
import { generateChallenge } from '@/services/auth/challenge';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { publicKey } = body;

        if (!publicKey) {
            return NextResponse.json({ error: 'publicKey is required' }, { status: 400 });
        }

        const challenge = generateChallenge(publicKey);
        return NextResponse.json(challenge);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

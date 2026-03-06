import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Export an explicitly named function for Next.js to use instead of a generic export from crypto
export const generateSHA256 = (data: string) => {
    return crypto.createHash('sha256').update(data).digest();
};

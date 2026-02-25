import { crypto } from 'crypto';

/**
 * Deterministically derives a secret key from username and password.
 * This is a simplified version for implementation.
 */
export async function deriveKey(username: string, password: string): Promise<string> {
    // In production, use PBKDF2 or Argon2
    const input = `${username}:${password}:atlas-salt`;
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Buffer.from(hash).toString('hex');
}

export function generateChallenge(publicKey: string): string {
    return `atlas-auth-${publicKey}-${Date.now()}-${Math.random().toString(36).substring(7)}`;
}

import { Keypair } from '@solana/web3.js';
import crypto from 'crypto';

/**
 * Derives a deterministic Solana keypair from a username and password.
 * The password and private key are NEVER stored on the server.
 */
export const deriveKeypair = (username: string, password: string): Keypair => {
    // We use a deterministic approach: pbkdf2 with a fixed salt based on the username.
    // In a real application, consider a strong KDF like Argon2 in the browser,
    // and only sending the public key and signed challenge to the server.
    // However, the spec allows key derivation client-side or server-side as long as 
    // the password is never stored or logged and the private key is not persisted.

    // Create a deterministic 32-byte seed from username and password
    const salt = crypto.createHash('sha256').update(`atlas_quant_${username}`).digest();
    const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');

    return Keypair.fromSeed(key);
};

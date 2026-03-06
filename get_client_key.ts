import nacl from 'tweetnacl';
import bs58 from 'bs58';
import crypto from 'crypto';

export const deriveClientKeypair = async (username: string, password: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(username + ':' + password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const seed = new Uint8Array(hashBuffer);
    const keypair = nacl.sign.keyPair.fromSeed(seed);
    return bs58.encode(keypair.publicKey);
};

deriveClientKeypair('nayrbryanGaming', 'nayrbryanGaming').then(console.log);

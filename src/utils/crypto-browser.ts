import nacl from 'tweetnacl';
import bs58 from 'bs58';

export const deriveClientKeypair = async (username: string, password: string) => {
    // We use Web Crypto API to hash the credentials securely on the client
    const encoder = new TextEncoder();
    const data = encoder.encode(username + ':' + password);

    // Hash to get a 32-byte seed
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const seed = new Uint8Array(hashBuffer);

    // Deterministic Ed25519 keypair
    const keypair = nacl.sign.keyPair.fromSeed(seed);
    return {
        publicKeyBytes: keypair.publicKey,
        secretKeyBytes: keypair.secretKey,
        publicKeyBase58: bs58.encode(keypair.publicKey)
    };
};

export const signMessageClient = (message: string, secretKeyBytes: Uint8Array): string => {
    const messageBytes = new TextEncoder().encode(message);
    const signature = nacl.sign.detached(messageBytes, secretKeyBytes);
    return bs58.encode(signature);
};

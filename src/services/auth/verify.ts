import nacl from 'tweetnacl';
import bs58 from 'bs58';
import { verifyStatelessChallenge } from './challenge';
import { AuthChallenge } from '@/domain/user';

/**
 * Validates an ed25519 signature of the current server-issued challenge
 */
export const verifySignature = (publicKeyBase58: string, signatureBase58: string, challenge: AuthChallenge): boolean => {
    // 1. Verify the challenge itself was issued by us and hasn't expired
    if (!verifyStatelessChallenge(challenge)) {
        return false;
    }

    try {
        const pubKeyBytes = bs58.decode(publicKeyBase58);
        const sigBytes = bs58.decode(signatureBase58);
        const messageBytes = new TextEncoder().encode(challenge.message);

        // 2. Verify the user actually signed this specific nonce/message
        const isValid = nacl.sign.detached.verify(messageBytes, sigBytes, pubKeyBytes);

        return isValid;
    } catch (error) {
        return false;
    }
};

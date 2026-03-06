import { deriveKeypair } from './src/services/auth/key-derivation';
console.log(deriveKeypair('nayrbryanGaming', 'nayrbryanGaming').publicKey.toBase58());

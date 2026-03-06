const { Keypair } = require('@solana/web3.js');
const crypto = require('crypto');

const deriveKeypair = (username, password) => {
    const salt = crypto.createHash('sha256').update(`atlas_quant_${username}`).digest();
    const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
    return Keypair.fromSeed(key);
};

const kp = deriveKeypair('nayrbryanGaming', 'nayrbryanGaming');
console.log('PUBLIC_KEY:', kp.publicKey.toBase58());

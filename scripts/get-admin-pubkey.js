const crypto = require('crypto');
const { Keypair } = require('@solana/web3.js');

const username = 'nayrbryanGaming';
const password = 'nayrbryanGaming';

const salt = crypto.createHash('sha256').update(`atlas_quant_${username}`).digest();
const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
const keypair = Keypair.fromSeed(key);

console.log('PUBLIC_KEY:', keypair.publicKey.toBase58());

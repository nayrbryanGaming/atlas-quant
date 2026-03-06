import { Connection, PublicKey } from '@solana/web3.js';
import { ENV } from '@/config/env';

export const solanaConnection = new Connection(ENV.SOLANA_RPC_URL, 'confirmed');
export const getMasterPublicKey = () => new PublicKey(ENV.MASTER_PUBLIC_KEY || '11111111111111111111111111111111');

export interface UserSession {
  publicKey: string;
  isApproved: boolean;
  balanceSol: number;
  expiresAt: number;
}

export interface AuthChallenge {
  publicKey: string;
  nonce: string;
  timestamp: number;
}

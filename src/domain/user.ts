export interface UserIdentity {
  publicKey: string;
}

export interface UserSession {
  publicKey: string;
  token: string;
  expiresAt: number;
}

export interface AuthChallenge {
  message: string;
  expiresAt: number;
  serverSig?: string; // Signature from server to ensure stateless authenticity
}

export type SolanaConnectOptions = {
  onlyIfTrusted?: boolean;
}

export interface SolanaPublicKey {
  toString: () => string,
}

export interface Solana {
  isConnected: boolean;
  on: (event: string, cb: () => void) => void;
  publicKey: SolanaPublicKey;
  connect: (options?: SolanaConnectOptions) => Promise<any>;
}
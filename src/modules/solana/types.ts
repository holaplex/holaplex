import { PublicKey, Transaction } from '@solana/web3.js';

export type SolanaConnectOptions = {
  onlyIfTrusted?: boolean;
};

export interface SolanaPublicKey {
  toString: () => string;
}

export interface Signature {
  publicKey: PublicKey;
  signature: Buffer;
}

export interface Solana {
  isConnected: boolean;
  on: (event: string, cb: () => void) => void;
  off: (event: string, cb: () => void) => void;
  once: (event: string, cb: () => void) => void;
  publicKey: SolanaPublicKey;
  connect: (options?: SolanaConnectOptions) => Promise<any>;
  signTransaction: (tx: Transaction) => Promise<Transaction>;
  signMessage: (input: ArrayBuffer, enc: string) => Promise<Signature>;
}

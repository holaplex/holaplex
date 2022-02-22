import { PublicKey, Transaction } from '@solana/web3.js';

export type SolanaConnectOptions = {
  onlyIfTrusted?: boolean;
};

export interface Signature {
  publicKey: PublicKey;
  signature: Buffer;
}

export interface Solana {
  isConnected: boolean;
  on: (event: string, cb: () => void) => void;
  off: (event: string, cb: () => void) => void;
  once: (event: string, cb: () => void) => void;
  publicKey: PublicKey;
  connect: (options?: SolanaConnectOptions) => Promise<any>;
  signTransaction: (tx: Transaction) => Promise<Transaction>;
  signAllTransactions(txs: Transaction[]): Promise<Transaction[]>;
  signMessage: (input: ArrayBuffer, enc: string) => Promise<Signature>;
  signAndSendTransaction: (tx: Transaction) => Promise<string>;
  sendRawTransactionAndConfirm: (rawTrasnaction: Buffer) => Promise<string>;
}

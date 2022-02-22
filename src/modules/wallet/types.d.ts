export interface Wallet {
  pubkey: string;
  approved: boolean;
};

declare global {
  interface Window {
    solana: Solana | undefined;
  }
}

export type SuccessConnectFn = (wallet: Wallet) => Promise<any>;

export type ConnectFn = (onSuccess: SuccessConnectFn) => void;
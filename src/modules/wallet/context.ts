import { Solana } from '@/modules/solana/types';
import { Storefront } from '@/modules/storefront/types';
import React from 'react';
import { Wallet } from './types';

declare global {
  interface Window {
    solana: Solana | undefined;
  }
}
export type WalletContextProps = {
  verifying: boolean;
  wallet?: Wallet;
  initializing: boolean;
  solana?: Solana;
  connect: (params?: any) => any;
  storefront?: Storefront;
};

export const WalletContext = React.createContext<WalletContextProps>({
  verifying: false,
  initializing: true,
  connect: () => {},
});

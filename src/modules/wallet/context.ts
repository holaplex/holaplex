import { Solana } from '@/modules/solana/types';
import React from 'react';
import { Storefront } from '@/modules/storefront/types';
import { Wallet, ConnectFn } from './types';

export type WalletContextProps = {
  verifying: boolean;
  wallet?: Wallet;
  initializing: boolean;
  solana?: Solana;
  connect: ConnectFn;
  storefront?: Storefront;
};

export const WalletContext = React.createContext<WalletContextProps>({
  verifying: false,
  initializing: true,
  connect: () => {},
});

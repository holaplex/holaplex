import { Storefront } from '@/modules/storefront/types';
import React from 'react';
import { Wallet } from '@solana/wallet-adapter-react';

export type WalletContextProps = {
  verifying: boolean;
  connect: (params?: any) => any;
  storefront?: Storefront;
};

export const WalletContext = React.createContext<WalletContextProps>({
  verifying: false,
  connect: () => {},
});

import { Solana } from '@/modules/solana/types';
import React from 'react';
import { Wallet, ConnectFn } from './types';

export type WalletContextProps = {
  verifying: boolean;
  wallet?: Wallet;
  initializing: boolean;
  solana?: Solana;
  connect: ConnectFn;
};

export const WalletContext = React.createContext<WalletContextProps>({
  verifying: false,
  initializing: true,
  connect: () => {},
});

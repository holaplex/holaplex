import React from 'react';
import { Wallet } from './types';
import { WalletContextState } from '@solana/wallet-adapter-react';

export interface WalletContextProps {
  wallet?: Wallet;
  solana?: WalletContextState;
  looking: boolean;
};

export const WalletContext = React.createContext<WalletContextProps>({ looking: false });

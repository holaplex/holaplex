import React from 'react'
import { Wallet } from './types'
import { Solana } from '@/modules/solana/types'


declare global {
  interface Window {
    solana: Solana;
  }
}
export type WalletContextProps = {
  verifying: boolean;
  wallet?: Wallet;
  initializing: boolean;
  solana?: Solana;
  connect: (params?: any) => any;
  arweaveWallet?: any;
  arweaveBalance: number;
  displayArweaveRoadblock: (display: boolean) => void;
  arweaveRoadblockVisible: boolean;

}

export const WalletContext = React.createContext<WalletContextProps>({ verifying: false, initializing: true, connect: () => {}, })

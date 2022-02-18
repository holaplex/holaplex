import React from 'react';
import { Storefront } from '@/modules/storefront/types';
import { ConnectFn } from './types';

export type WalletContextProps = {
  verifying: boolean;
  connect: ConnectFn;
  storefront?: Storefront;
};

export const WalletContext = React.createContext<WalletContextProps>({
  verifying: false,
  connect: () => {},
});

import React, { SetStateAction, Dispatch, useContext } from 'react';
import { Storefront } from './types';

export type StorefrontContextProps = {
  storefront?: Storefront;
  searching: boolean;
};

export const StorefrontContext = React.createContext<StorefrontContextProps>({ searching: false });

export function useStorefront() {
  const context = useContext(StorefrontContext);
  if (context === null) {
    throw new Error('useStorefront must be used within a StorefrontProvider');
  }
  return context;
}

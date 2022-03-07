
import React, { useState } from 'react';
import { Wallet } from '@/modules/wallet/types';
import { Marketplace } from './types';
import { MarketplaceContext } from './context';

type StorefrontProviderChildrenProps = {
  searching: boolean;
  marketplace?: Marketplace;
};

type StorefrontProviderProps = {
  wallet?: Wallet;
  children: (props: StorefrontProviderChildrenProps) => React.ReactElement;
};

export const MarketplaceProvider = ({ wallet, children }: StorefrontProviderProps) => {
  const [searching, setSearching] = useState(false);
  const [marketplace, setMarketplace] = useState<Marketplace>();

  return (
    <MarketplaceContext.Provider value={{ searching, marketplace }}>
      {children({ searching, marketplace })}
    </MarketplaceContext.Provider>
  );
};

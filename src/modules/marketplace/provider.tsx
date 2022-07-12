import React, { FC, useState } from 'react';
import { Wallet } from '@/modules/wallet/types';
import { Marketplace } from './types';
import { MarketplaceContext } from './context';

export const MarketplaceProvider: FC = (props) => {
  const [searching, setSearching] = useState(false);
  const [marketplace, setMarketplace] = useState<Marketplace>();

  return (
    <MarketplaceContext.Provider value={{ searching, marketplace }}>
      {props.children}
    </MarketplaceContext.Provider>
  );
};

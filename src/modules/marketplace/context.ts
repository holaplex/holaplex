import React from 'react';
import { Marketplace } from './types';

export type MarketplaceContextProps = {
  marketplace?: Marketplace;
  searching: boolean;
};

export const MarketplaceContext = React.createContext<MarketplaceContextProps>({ searching: false });

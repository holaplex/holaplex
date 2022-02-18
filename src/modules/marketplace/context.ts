import React from 'react';
import { Marketplace } from './types';

export type MarketplaceContextProps = {
  marketplace?: Marketplace;
  searching: boolean;
  connectMarketplace: () => void;
};

export const MarketplaceContext = React.createContext<MarketplaceContextProps>({ searching: false, connectMarketplace: () => {} });

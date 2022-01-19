import React, { useEffect, useState } from 'react';
import { curry } from 'ramda';
import { initArweave } from '@/modules/arweave';
import arweaveSDK from '@/modules/arweave/client';
import { isNil } from 'ramda';
import { useRouter } from 'next/router';
import { Wallet, ConnectFn } from '@/modules/wallet/types';
import { Marketplace } from './types';
import { MarketplaceContext } from './context';

type StorefrontProviderChildrenProps = {
  searching: boolean;
  marketplace?: Marketplace;
};

type StorefrontProviderProps = {
  wallet?: Wallet;
  children: (props: StorefrontProviderChildrenProps) => React.ReactElement;
  connect: ConnectFn;
};

export const MarketplaceProvider = ({ wallet, children, connect }: StorefrontProviderProps) => {
  const [searching, setSearching] = useState(false);
  const [marketplace, setMarketplace] = useState<Marketplace>();
  const router = useRouter();
  const arweave = initArweave();

  const onSuccesConnect = async (wallet: Wallet) => {
        router.push('/marketplace/new');

        return Promise.resolve();
    }

    const connectMarketplace = () => connect(onSuccesConnect);

    return (
      <MarketplaceContext.Provider value={{ searching, marketplace, connectMarketplace }}>
        {children({ searching, marketplace })}
      </MarketplaceContext.Provider>
    );
  };

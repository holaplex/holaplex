import React, { useEffect, useState } from 'react';
import { initArweave } from '@/modules/arweave';
import arweaveSDK from '@/modules/arweave/client';
import { isNil } from 'ramda';
import { Storefront } from '@/modules/storefront/types';
import { Wallet } from '@/modules/wallet/types';
import { StorefrontContext } from './context';

type StorefrontProviderChildrenProps = {
  searching: boolean;
  storefront?: Storefront;
};

type StorefrontProviderProps = {
  wallet?: Wallet;
  children: (props: StorefrontProviderChildrenProps) => React.ReactElement;
};

export const StorefrontProvider = ({ wallet, children }: StorefrontProviderProps) => {
  const [searching, setSearching] = useState(false);
  const [storefront, setStorefront] = useState<Storefront>();
  const arweave = initArweave();
  const arweaveClient = arweaveSDK.using(arweave);

  useEffect(() => {
    if (typeof window === 'undefined' || !wallet?.pubkey) {
      return;
    }

    setSearching(true);

    arweaveClient.storefront.find('solana:pubkey', wallet.pubkey).then((storefront) => {
      if (isNil(storefront)) {
        setSearching(false);

        return;
      }

      setStorefront(storefront);
      setSearching(false);
    });
  }, [wallet?.pubkey]);

  return (
    <StorefrontContext.Provider value={{ searching, storefront }}>
      {children({ searching, storefront })}
    </StorefrontContext.Provider>
  );
};

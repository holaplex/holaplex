import React, { useEffect, useState } from 'react';
import { initArweave } from '@/modules/arweave';
import arweaveSDK from '@/modules/arweave/client';
import { isNil } from 'ramda';
import { Storefront } from '@/modules/storefront/types';
import { StorefrontContext } from './context';
import { useWallet } from '@solana/wallet-adapter-react';

type StorefrontProviderChildrenProps = {
  searching: boolean;
  storefront?: Storefront;
};

type StorefrontProviderProps = {
  children: (props: StorefrontProviderChildrenProps) => React.ReactElement;
};

export const StorefrontProvider = ({ children }: StorefrontProviderProps) => {
  const [searching, setSearching] = useState(false);
  const [storefront, setStorefront] = useState<Storefront>();
  const arweave = initArweave();
  const { publicKey} = useWallet();

  useEffect(() => {
    const pub_key = publicKey?.toString();
    if (!process.browser || !pub_key) {
      return;
    }

    setSearching(true);

    arweaveSDK
      .using(arweave)
      .storefront.find('solana:pubkey', pub_key)
      .then((storefront) => {
        if (isNil(storefront)) {
          setSearching(false);

          return;
        }

        setStorefront(storefront);
        setSearching(false);
      });
  }, [publicKey]);

  return (
    <StorefrontContext.Provider value={{ searching, storefront }}>
      {children({ searching, storefront })}
    </StorefrontContext.Provider>
  );
};

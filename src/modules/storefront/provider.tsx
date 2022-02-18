import React, { useEffect, useState } from 'react';
import { curry } from 'ramda';
import { initArweave } from '@/modules/arweave';
import arweaveSDK from '@/modules/arweave/client';
import { isNil } from 'ramda';
import { useRouter } from 'next/router';
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
  const router = useRouter();
  const { publicKey } = useWallet();
  const arweave = initArweave();

  const onSuccesConnect = async () => {
    return arweaveSDK
      .using(arweave)
      .storefront.find('solana:pubkey', publicKey?.toString() || '')
      .then((storefront: any) => {
        setStorefront(storefront);
        if (storefront) {
          return router.push('/storefront/edit');
        }

        return router.push('/storefront/new');
      });
  };

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

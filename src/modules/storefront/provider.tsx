import React, { useEffect, useState } from 'react';
import { curry } from 'ramda';
import { initArweave } from '@/modules/arweave';
import arweaveSDK from '@/modules/arweave/client';
import { isNil } from 'ramda';
import { useRouter } from 'next/router';
import { Storefront } from '@/modules/storefront/types';
import { Wallet, ConnectFn } from '@/modules/wallet/types';
import { StorefrontContext } from './context';

type StorefrontProviderChildrenProps = {
  searching: boolean;
  storefront?: Storefront;
};

type StorefrontProviderProps = {
  wallet?: Wallet;
  children: (props: StorefrontProviderChildrenProps) => React.ReactElement;
  connect: ConnectFn;
};

export const StorefrontProvider = ({ wallet, children, connect }: StorefrontProviderProps) => {
  const [searching, setSearching] = useState(false);
  const [storefront, setStorefront] = useState<Storefront>();
  const router = useRouter();
  const arweave = initArweave();

  const onSuccesConnect = async (wallet: Wallet) => {
    return arweaveSDK
      .using(arweave)
      .storefront.find('solana:pubkey', wallet.pubkey)
      .then((storefront: any) => {
        
        setStorefront(storefront);
        if (storefront) {
          return router.push('/storefront/edit');
        }

        return router.push('/storefront/new');
      });
    }

    const connectStorefront = () => connect(onSuccesConnect);

    useEffect(() => {
      if (!process.browser || !wallet) {
        return;
      }

      setSearching(true);

      arweaveSDK
        .using(arweave)
        .storefront.find('solana:pubkey', wallet.pubkey)
        .then((storefront) => {
          if (isNil(storefront)) {
            setSearching(false);

            return;
          }

          setStorefront(storefront);
          setSearching(false);
        });
    }, [wallet]);

    return (
      <StorefrontContext.Provider value={{ searching, storefront, connectStorefront }}>
        {children({ searching, storefront })}
      </StorefrontContext.Provider>
    );
  };

import React, { FC, useEffect, useState } from 'react';
import { initArweave } from '@/modules/arweave';
import arweaveSDK from '@/modules/arweave/client';
import { isNil } from 'ramda';
import { Storefront } from '@/modules/storefront/types';
import { StorefrontContext } from './context';
import { useWallet } from '@solana/wallet-adapter-react';

export const StorefrontProvider: FC = ({ children }) => {
  const [searching, setSearching] = useState(false);
  const [storefront, setStorefront] = useState<Storefront>();
  const arweave = initArweave();
  const arweaveClient = arweaveSDK.using(arweave);
  const { publicKey } = useWallet();
  const pubkey = publicKey?.toBase58();

  useEffect(() => {
    if (typeof window === 'undefined' || !pubkey) {
      return;
    }

    setSearching(true);

    arweaveClient.storefront.find('solana:pubkey', pubkey).then((storefront) => {
      if (isNil(storefront)) {
        setSearching(false);

        return;
      }

      setStorefront(storefront);
      setSearching(false);
    });
  }, [pubkey]);

  return (
    <StorefrontContext.Provider value={{ searching, storefront }}>
      {children}
    </StorefrontContext.Provider>
  );
};

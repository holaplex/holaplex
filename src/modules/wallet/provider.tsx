import { initArweave } from '@/modules/arweave';
import arweaveSDK from '@/modules/arweave/client';
import { Solana } from '@/modules/solana/types';
import { Storefront } from '@/modules/storefront/types';
import walletSDK from '@/modules/wallet/client';
import { Wallet } from '@/modules/wallet/types';
import { useRouter } from 'next/router';
import { isNil } from 'ramda';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { WalletContext, WalletContextProps } from './context';

type WalletProviderProps = {
  wallet?: Wallet;
  solana?: Solana;
  children: (props: WalletContextProps) => React.ReactElement;
  storefront?: Storefront;
};

const upsertWallet = async (pubkey: string) => {
  return walletSDK.find(pubkey).then((wallet: any) => {
    if (!wallet) {
      return walletSDK.create(pubkey);
    }

    return Promise.resolve(wallet);
  });
};

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const router = useRouter();
  const arweave = initArweave();
  const [verifying, setVerifying] = useState(false);
  const [initializing, setInitialization] = useState(true);
  const [wallet, setWallet] = useState<Wallet>();
  const [solana, setSolana] = useState<Solana>();
  const [storefront, setStorefront] = useState<Storefront>();

  if (typeof window === 'object') {
    if (window.solana && window.solana?.connect) {
      if (window.solana !== solana) {
        setSolana(window.solana);
        setInitialization(false);
      }
    } else {
      window.addEventListener(
        'load',
        () => {
          setSolana(window.solana);
          setInitialization(false);
        },
        { capture: false }
      );
    }
  }

  const connect = (redirect?: string) => {
    if (isNil(solana)) {
      toast(() => (
        <>
          Phantom wallet is not installed on your browser. Visit{' '}
          <a href="https://phantom.app">phantom.app</a> to setup your wallet.
        </>
      ));
      return;
    }

    solana.once('connect', () => {
      const solanaPubkey = solana.publicKey.toString();

      upsertWallet(solanaPubkey)
        .then((wallet) => {
          setWallet(wallet);
          return arweaveSDK.using(arweave).storefront.find('solana:pubkey', wallet.pubkey);
        })
        .then((storefront: any) => {
          setStorefront(storefront);
          if (redirect) {
            if (redirect === '') {
              return;
            }
            return router.push(redirect);
          }

          if (storefront) {
            return router.push('/storefront/edit');
          }

          return router.push('/storefront/new');
        })
        .catch(() => router.push('/'))
        .finally(() => {
          setVerifying(false);
        });
    });

    setVerifying(true);

    solana.connect();
  };

  return (
    <WalletContext.Provider
      value={{
        verifying,
        initializing,
        wallet,
        solana,
        connect,
        storefront,
      }}
    >
      {children({
        verifying,
        initializing,
        wallet,
        solana,
        connect,
        storefront,
      })}
    </WalletContext.Provider>
  );
};

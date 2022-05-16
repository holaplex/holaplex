import walletSDK from '@/modules/wallet/client';
import { Wallet } from '@/modules/wallet/types';
import { useWallet, WalletContextState } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { WalletContext, WalletContextProps } from './context';

interface WalletProviderProps {
  wallet?: Wallet;
  solana?: WalletContextState;
  children: (props: WalletContextProps) => React.ReactElement;
};

const upsertWallet = async (pubkey: string | undefined) => {
  if (!pubkey) {
    return Promise.reject("no public key");
  }

  return walletSDK.find(pubkey).then((wallet: any) => {
    if (!wallet) {
      return walletSDK.create(pubkey);
    }

    return Promise.resolve(wallet);
  });
};

/**
 * 
 * @deprecated Use `WalletProvider` from (@solana/wallet-adapter) instead.
 */
export const WalletProviderDeprecated = ({ children }: WalletProviderProps) => {
  const router = useRouter();
  const [wallet, setWallet] = useState<Wallet>();
  const [looking, setLooking] = useState(false);
  const solana = useWallet();
  const { publicKey } = solana;

  useEffect(() => {
    if (!publicKey) {
      return;
    }

    setLooking(true);

    upsertWallet(publicKey.toBase58())
      .then((wallet: Wallet) => {
        setWallet(wallet);

        return wallet;
      })
      .catch(() => router.push('/'))
      .finally(() => {
        setLooking(false);
      });
  }, [router, publicKey])

  return (
    <WalletContext.Provider
      value={{
        wallet,
        solana,
        looking,
      }}
    >
      {children({
        wallet,
        solana,
        looking
      })}
    </WalletContext.Provider>
  );
};

import { initArweave } from '@/modules/arweave';
import arweaveSDK from '@/modules/arweave/client';
import { Storefront } from '@/modules/storefront/types';
import walletSDK from '@/modules/wallet/client';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { WalletContext, WalletContextProps } from './context';

type WalletProviderProps = {
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
  const [storefront, setStorefront] = useState<Storefront>();
  const {wallet, publicKey} = useWallet();

  const connect = (redirect?: string) => {
  wallet?.adapter.once("connect", async (pubKey) => {
    try {
    const pub_key = publicKey?.toString();
    if(!pub_key) throw new Error("Wallet not connected");
    await upsertWallet(pub_key);
    const sf = await arweaveSDK.using(arweave).storefront.find('solana:pubkey', pub_key);
    if(sf)
      setStorefront(sf); 
    setVerifying(false);
    if (redirect) return router.push(redirect);
    if (sf) return router.push('/storefront/edit');
    return router.push('/storefront/new');
    } catch (error) {
      return router.push("/");
    }
  });
  setVerifying(true);
  if(!wallet?.adapter || wallet.readyState === "Unsupported")
  {
    if(redirect) router.push(redirect);
    setVerifying(false);
  }
  else  wallet.adapter.connect().catch(() => {
    if (redirect) {
      router.push(redirect);
    }
    setVerifying(false);
  });
}

  return (
    <WalletContext.Provider
      value={{
        verifying,
        connect,
        storefront,
      }}
    >
      {children({
        verifying,
        connect,
        storefront,
      })}
    </WalletContext.Provider>
  );
};

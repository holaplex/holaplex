import { initArweave } from '@/modules/arweave';
import arweaveSDK from '@/modules/arweave/client';
import walletSDK from '@/modules/wallet/client';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useRef, useState, useContext } from 'react';
import { WalletContext, WalletContextProps } from './context';
import { Storefront } from '@/modules/storefront/types';

type WalletProviderProps = {
  children: (props: WalletContextProps) => React.ReactElement;
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
  const { wallet, connected, publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const redirect = useRef('');
  const [storefront, setStorefront] = useState<Storefront>();

  useEffect(() => {
    (async () => {
      if (connected && publicKey) {
        setVerifying(true);
        try {
          const pub_key = publicKey?.toString();
          if (!pub_key) throw new Error('Wallet not connected');
          await upsertWallet(pub_key);
          const sf = await arweaveSDK.using(arweave).storefront.find('solana:pubkey', pub_key);
          if (sf) setStorefront(sf);
          setVerifying(false);
          if (redirect.current) {
            const path = redirect.current;
            redirect.current = '';
            return router.push(path);
          }
          if (sf) return router.push('/storefront/edit');
          return router.push('/storefront/new');
        } catch (error) {
          setVerifying(false);
          return router.push('/');
        }
      }
    })();
  }, [connected, publicKey]);

  const connect = useCallback(
    (redir?: string) => {
      redirect.current = redir ?? '';
      if (wallet && wallet.adapter) {
        if (connected) return router.push(redirect.current);
        wallet.adapter.connect().catch(() => {});
      } else setVisible(true);
    },
    [wallet]
  );

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

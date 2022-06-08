import { AnchorWallet, useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import React, { useContext, useEffect, useMemo } from 'react';
import {
  GetConnectedWalletProfileDataQuery,
  useGetConnectedWalletProfileDataLazyQuery,
  useGetConnectedWalletProfileDataQuery,
} from 'src/graphql/indexerTypes';

type WalletProfile = GetConnectedWalletProfileDataQuery['followers'][0]['from'];

interface ConnectedWalletProfileData {
  connectedProfile: {
    pubkey: string | null;
    profile?: {
      handle: string;
      profileImageUrlLowres: string;
      profileImageUrlHighres: string;
    } | null;
    nftCounts: {
      owned: number;
      created: number;
      offered: number;
      listed: number;
    };
    connectionCounts: {
      fromCount: number;
      toCount: number;
    };
    followers: WalletProfile[] | null;
    following: WalletProfile[] | null;
    walletConnectionPair: {
      wallet: AnchorWallet;
      connection: Connection;
    } | null;
  } | null;
}
const ConnectedWalletProfileContext = React.createContext<ConnectedWalletProfileData | null>(null);

export function ConnectedWalletProfileProvider(props: { children: React.ReactNode }) {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();

  const walletConnectionPair = useMemo(() => {
    if (!wallet) return null;
    return { wallet, connection };
  }, [wallet, connection]);

  const pubkey = wallet?.publicKey.toBase58();

  const { data, loading } = useGetConnectedWalletProfileDataQuery({
    variables: {
      address: pubkey,
    },
    skip: !pubkey,
  });

  // should maybe be put in a useMemo
  const connectedWalletProfileData: ConnectedWalletProfileData = {
    connectedProfile:
      pubkey && data
        ? {
            pubkey: pubkey,
            profile: data.wallet.profile,
            nftCounts: data.wallet.nftCounts,
            connectionCounts: data.wallet.connectionCounts,
            followers: data.followers.map((f) => f.from) ?? [],
            following: data.following.map((f) => f.to) ?? [],
            walletConnectionPair,
          }
        : null,
  };

  return (
    <ConnectedWalletProfileContext.Provider value={connectedWalletProfileData}>
      {props.children}
    </ConnectedWalletProfileContext.Provider>
  );
}

export const useConnectedWalletProfile = () => {
  const connectedWalletProfileData = useContext(ConnectedWalletProfileContext);
  if (!connectedWalletProfileData) {
    throw new Error(
      'useConnectedWalletProfile must be used within a ConnectedWalletProfileProvider'
    );
  }
  return connectedWalletProfileData;
};

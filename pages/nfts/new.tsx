import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';
import Head from 'next/head';
import { WalletContext } from '@/modules/wallet';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletReadyState } from '@solana/wallet-adapter-base';

export default function New() {
  const router = useRouter();
  const { connect } = useContext(WalletContext);
  const { wallet } = useWallet();

  useEffect(() => {
    if (wallet?.adapter && wallet.readyState !== WalletReadyState.Unsupported) {
      connect(router.pathname);
    } else {
      router.push('/?action=mint');
    }
  }, [connect, router, wallet]);

  return (
    <div>
      <Head>
        <title>Mint NFTs | Design and Host Your Metaplex NFT Storefront | Holaplex</title>
        <meta
          property="description"
          key="description"
          content="Minting an NFT is how your digital art becomes a part of the Solana blockchain - a public ledger that is unchangeable and tamper-proof."
        />
      </Head>
    </div>
  );
}

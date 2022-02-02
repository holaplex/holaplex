import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';
import Head from 'next/head';
import { WalletContext } from '@/modules/wallet';

export default function New() {
  const router = useRouter();
  const { connect, wallet } = useContext(WalletContext);

  useEffect(() => {
    if (!wallet) {
      connect(router.pathname);
    } else {
      router.push('/?action=mint');
    }
  }, [connect, wallet]);

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

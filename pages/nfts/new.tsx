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
    }
    router.push('/?action=mint');
  }, [connect, wallet]);

  return (
    <div>
      <Head>
        <title>Mint NFTs | Design and Host Your Metaplex NFT Storefront</title>
      </Head>
    </div>
  );
}

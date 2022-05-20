import { useRouter } from 'next/router';
import React from 'react';
import Head from 'next/head';
import { useWallet } from '@solana/wallet-adapter-react';
import { Row, Card, Space, Typography } from 'antd';
import Button from '@/components/elements/Button';
import MintModal from '@/common/components/elements/MintModal';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

export default function CreateNFTs() {
  const router = useRouter();
  const { publicKey, connecting } = useWallet();
  const { setVisible } = useWalletModal();

  if (!publicKey) {
    return (
      <Row justify="center">
        <Card>
          <Space direction="vertical">
            <Typography.Paragraph>Connect your Solana wallet to create NFTs.</Typography.Paragraph>
            <Button loading={connecting} block onClick={() => setVisible(true)}>
              Connect
            </Button>
          </Space>
        </Card>
      </Row>
    );
  }

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
      <MintModal show onClose={() => router.back()} />
    </div>
  );
}

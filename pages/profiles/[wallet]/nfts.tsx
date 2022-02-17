import { ProfileContainer } from '@/common/components/elements/ProfileContainer';
import { testData } from '@/common/components/elements/test-nft-data';
import { showFirstAndLastFour } from '@/modules/utils/string';
import { PublicKey } from '@solana/web3.js';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styled from 'styled-components';

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      wallet: context.query.wallet,
    },
  };
};

const Description = styled.div`
  background: #171717;
  height: 96px;
  padding: 24px 16px;
  p {
    font-size: 20px;
  }

  img {
    border-radius: 8px;
  }
`;

const NFTCard = ({ nft }) => {
  return (
    <div>
      <img src={nft.image} alt="nft" />
      <Description>
        <p>{nft.name}</p>
      </Description>
    </div>
  );
};

const NFTGrid = ({ nfts }) => {
  return (
    <StyledNFTGrid>
      {nfts.map((nft) => (
        <NFTCard key={nft.name} nft={nft} />
      ))}
    </StyledNFTGrid>
  );
};

const ProfileNFTs = ({ wallet }: { wallet: string }) => {
  const publicKey = wallet ? new PublicKey(wallet as string) : null;
  const nfts = testData;
  return (
    <>
      <Head>
        <title>{showFirstAndLastFour(wallet)}&apos;s profile | Holaplex</title>
        <meta property="description" key="description" content="View owned and created NFTs" />
      </Head>
      <ProfileContainer wallet={wallet} publicKey={publicKey}>
        <NFTGrid nfts={nfts} />
      </ProfileContainer>
    </>
  );
};

export default ProfileNFTs;

const StyledNFTGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  img {
    width: 300px;
    height: 320px;
    object-fit: cover;
  }
`;

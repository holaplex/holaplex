import { ProfileContainer } from '@/common/components/elements/ProfileContainer';
import { showFirstAndLastFour } from '@/modules/utils/string';
import { PublicKey } from '@solana/web3.js';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      wallet: context.query.wallet,
    },
  };
};

const ProfileNFTs = ({ wallet }: { wallet: string }) => {
  const publicKey = wallet ? new PublicKey(wallet as string) : null;
  return (
    <>
      <Head>
        <title>{showFirstAndLastFour(wallet)}&apos;s profile | Holaplex</title>
        <meta property="description" key="description" content="View owned and created NFTs" />
      </Head>
      <ProfileContainer wallet={wallet} publicKey={publicKey}>
        <div>NFTs listed here</div>
      </ProfileContainer>
    </>
  );
};

export default ProfileNFTs;

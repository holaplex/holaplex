import { ActivityContent } from '@/common/components/elements/ActivityContent';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { PublicKey } from '@solana/web3.js';
import { showFirstAndLastFour } from '@/modules/utils/string';
import { ProfileContainer } from '@/common/components/elements/ProfileContainer';
import { useWallet } from '@solana/wallet-adapter-react';
import FeedContainer from '@/common/components/feed/FeedContainer';
// export const getServerSideProps: GetServerSideProps = async (context) => {
//   return {
//     props: {
//     },
//   };
// };

const FeedPage = () => {
  const { publicKey: connectedPubkey } = useWallet();
  const myPubkey = connectedPubkey?.toBase58();

  if (!myPubkey) return null;

  return (
    <>
      <Head>
        <title>Personal feed | Holaplex</title>
        <meta
          property="description"
          key="description"
          content="Your personalized feed for all things Holaplex and Solana"
        />
      </Head>
      <div className="mx-auto w-full max-w-7xl">
        <FeedContainer />
      </div>
    </>
  );
};

export default FeedPage;

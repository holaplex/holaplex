import { ActivityContent } from '@/common/components/elements/ActivityContent';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { PublicKey } from '@solana/web3.js';
import { showFirstAndLastFour } from '@/modules/utils/string';
import { ProfileContainer } from '@/common/components/elements/ProfileContainer';

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      // query params must be gotten serverside to be available on initial render
      wallet: context.query.wallet,
    },
  };
};

const ActivityLanding = ({ wallet }: { wallet: string }) => {
  const publicKey = wallet ? new PublicKey(wallet as string) : null;
  return (
    <>
      <Head>
        <title>{showFirstAndLastFour(wallet)}&apos;s profile | Holaplex</title>
        <meta
          property="description"
          key="description"
          content="View activity for this, or any other pubkey, in the Holaplex ecosystem."
        />
      </Head>
      <ProfileContainer wallet={wallet} publicKey={publicKey}>
        <ActivityContent publicKey={publicKey} />
      </ProfileContainer>
    </>
  );
};

export default ActivityLanding;

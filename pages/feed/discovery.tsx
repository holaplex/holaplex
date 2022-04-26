import type { ReactElement } from 'react';
import { ActivityContent } from '@/common/components/elements/ActivityContent';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { PublicKey } from '@solana/web3.js';
import { showFirstAndLastFour } from '@/modules/utils/string';
import { ProfileContainer } from '@/common/components/elements/ProfileContainer';
import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';

import FeedLayout from '@/layouts/FeedLayout';
import { useFeedQuery } from 'src/graphql/indexerTypes';
import { FeedCard } from '@/common/components/feed/FeedCard';
// export const getServerSideProps: GetServerSideProps = async (context) => {
//   return {
//     props: {
//     },
//   };
// };

const DiscoveryFeedPage = () => {
  const famousPubkey = 'NWswq7QR7E1i1jkdkddHQUFtRPihqBmJ7MfnMCcUf4H';

  const anchorWallet = useAnchorWallet();

  const { data, loading, called, refetch } = useFeedQuery({
    fetchPolicy: `no-cache`,
    variables: {
      address: famousPubkey,
    },
  });

  return (
    <>
      <Head>
        <title>Discovery feed | Holaplex</title>
        <meta
          property="description"
          key="description"
          content="Your personalized feed for all things Holaplex and Solana"
        />
      </Head>
      <div className="space-y-24">
        {/* {loading && (
        <div className="flex h-96 w-full items-center justify-center">
          <Spinner />
        </div>
      )} */}
        {
          // @ts-ignore
          data?.feedEvents.map((fEvent) => (
            // @ts-ignore
            <FeedCard key={fEvent.feedEventId} event={fEvent} anchorWallet={anchorWallet} />
          ))
        }
      </div>
    </>
  );
};

export default DiscoveryFeedPage;

DiscoveryFeedPage.getLayout = function getLayout(page: ReactElement) {
  return <FeedLayout>{page}</FeedLayout>;
};

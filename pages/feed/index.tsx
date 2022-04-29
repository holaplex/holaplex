import { ReactElement, useState } from 'react';
import { ActivityContent } from '@/common/components/elements/ActivityContent';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { PublicKey } from '@solana/web3.js';
import { showFirstAndLastFour } from '@/modules/utils/string';
import { ProfileContainer } from '@/common/components/elements/ProfileContainer';
import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';

import FeedLayout from '@/layouts/FeedLayout';
import { MintEvent, useFeedQuery } from 'src/graphql/indexerTypes';
import { AggregateEvent, FeedCard, FeedCardContainer } from '@/common/components/feed/FeedCard';
import { InView } from 'react-intersection-observer';
import { TailSpin } from 'react-loader-spinner';
import { FeedEvent } from 'src/graphql/indexerTypes.ssr';

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   return {
//     props: {
//     },
//   };
// };

// FBNrpSJiM2FCTATss2N6gN9hxaNr6EqsLvrGBAi9cKW7 // folluther
// 2BNABAPHhYAxjpWRoKKnTsWT24jELuvadmZALvP6WvY4 // ghostfried
// GJMCz6W1mcjZZD8jK5kNSPzKWDVTD4vHZCgm8kCdiVNS // kayla
// 2fLigDC5sgXmcVMzQUz3vBqoHSj2yCbAJW1oYX8qbyoR // belle
// NWswq7QR7E1i1jkdkddHQUFtRPihqBmJ7MfnMCcUf4H // kris

export const INFINITE_SCROLL_AMOUNT_INCREMENT = 2;

const FeedPage = () => {
  const anchorWallet = useAnchorWallet();
  const myPubkey = anchorWallet?.publicKey.toBase58();
  const { data, loading, called, fetchMore } = useFeedQuery({
    fetchPolicy: `no-cache`,
    variables: {
      address: myPubkey,
      offset: 0,
      limit: 1000,
    },
  });

  const [hasMore, setHasMore] = useState(true);
  // const [feedEvents, setFeedEvents] = useState(data?.feedEvents || []);
  const feedEvents = data?.feedEvents ?? [];

  if (!myPubkey) return null;

  console.log('feed', {
    data,
    loading,
  });

  async function loadMore(inView: boolean) {
    console.log('load more feed', {
      inView,
      loading,
      feeedEvetnsN: feedEvents.length,
    });
    if (!inView || loading || feedEvents.length <= 0) {
      return;
    }

    const { data: newData } = await fetchMore({
      variables: {
        address: myPubkey,
        limit: INFINITE_SCROLL_AMOUNT_INCREMENT,
        offset: feedEvents.length + INFINITE_SCROLL_AMOUNT_INCREMENT,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        const prevFeedEvents = feedEvents; // prev.feedEvents;
        const moreFeedEvents = fetchMoreResult.feedEvents;
        if (moreFeedEvents.length === 0) {
          setHasMore(false);
        }

        console.log('update query', {
          prevFeedEventsN: prevFeedEvents?.length,
          moreFeedEventsN: moreFeedEvents?.length,
        });

        fetchMoreResult.feedEvents = prevFeedEvents.concat(moreFeedEvents);

        return { ...fetchMoreResult };
      },
    });
    // setFeedEvents(newData.feedEvents);
    console.log('newData', {
      feedEvents,
      newData,
      feedEventsN: feedEvents.length,
      newDataN: newData.feedEvents.length,
    });
  }

  // notes
  // observations
  // we will need to do some form of transformation/aggregation of the feedevents from the grapqhl endpoint in order to batch similar evetns on the frontend
  // relying directly on the graphql types leads to type hell

  // we could make a transformation and pass the rawEvent together for use in following/ offers

  function getFeedItems(feedEvents: typeof data.feedEvents): (FeedEvent | AggregateEvent)[] {
    const feedItems: (FeedEvent | AggregateEvent)[] = [];
    let i = 0;
    while (i < feedEvents.length) {
      const cur = feedEvents[i];
      const next = feedEvents[i + 1];
      feedItems.push(cur as FeedEvent);

      if (
        cur.__typename === 'MintEvent' &&
        next.__typename === 'MintEvent' &&
        cur.nft?.creators[0].address === next.nft?.creators[0].address
      ) {
        // const aggregateEvent = { items: [] };
        const eventsAggregated: FeedEvent[] = [];
        let j = i + 1;
        while (
          feedEvents[j] &&
          feedEvents[j].__typename === 'MintEvent' &&
          // @ts-ignore
          feedEvents[j]?.nft?.creators[0]?.address === cur?.nft?.creators[0]?.address
        ) {
          eventsAggregated.push(feedEvents[j] as FeedEvent);
          j++;
        }
        feedItems.push({
          id: 'agg_' + cur.feedEventId,
          __typename: 'AggregateEvent',
          createdAt: cur.createdAt,
          eventsAggregated,
        });
        i = j;
      } else {
        i++;
      }
    }

    return feedItems;
  }

  const feedItems = getFeedItems(data?.feedEvents || []);

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

      <div className="space-y-20">
        {
          // @ts-ignore
          feedItems.map((fEvent) => (
            // @ts-ignore
            <FeedCard key={fEvent.feedEventId} event={fEvent} anchorWallet={anchorWallet} />
          ))
        }
      </div>
      {hasMore && (
        <div>
          <InView threshold={0.1} onChange={loadMore}>
            <div className={`my-6 flex w-full items-center justify-center font-bold`}>
              <TailSpin height={50} width={50} color={`grey`} ariaLabel={`loading-nfts`} />
            </div>
          </InView>
        </div>
      )}
    </>
  );
};

export default FeedPage;

FeedPage.getLayout = function getLayout(page: ReactElement) {
  return <FeedLayout>{page}</FeedLayout>;
};

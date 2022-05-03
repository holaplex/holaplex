import { ReactElement, useState } from 'react';
import { ActivityContent } from '@/common/components/elements/ActivityContent';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { PublicKey } from '@solana/web3.js';
import { showFirstAndLastFour } from '@/modules/utils/string';
import { ProfileContainer } from '@/common/components/elements/ProfileContainer';
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';

import FeedLayout from '@/layouts/FeedLayout';
import {
  MintEvent,
  useFeedQuery,
  FeedQuery,
  useNftMarketplaceQuery,
  useMarketplacePreviewQuery,
} from 'src/graphql/indexerTypes';
import { FeedCard, FeedCardContainer } from '@/common/components/feed/FeedCard';
import { InView } from 'react-intersection-observer';
import { TailSpin } from 'react-loader-spinner';
import { FeedEvent } from 'src/graphql/indexerTypes.ssr';
import { useGetAllConnectionsFromWithTwitter } from '@/common/hooks/useGetAllConnectionsFrom';
import { FeedItem, FeedQueryEvent, shouldAggregate } from '@/common/components/feed/feed.utils';
import { HOLAPLEX_MARKETPLACE_SUBDOMAIN } from '@/common/constants/marketplace';
import { Marketplace } from '@holaplex/marketplace-js-sdk';
import { LoadingFeedCard, LoadingFeedItem } from '../../src/common/components/feed/LoadingFeed';
import NoFeed from '../../src/common/components/feed/NoFeed';

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
// 7r8oBPs3vNqgqEG8gnyPWUPgWuScxXyUxtmoLd1bg17F && alex
const INFINITE_SCROLL_AMOUNT_INCREMENT = 5;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      address: context.query?.address || null,
    },
  };
};

const FeedPage = ({ address }: { address: string }) => {
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();
  const myPubkey = address ?? anchorWallet?.publicKey.toBase58() ?? null;
  const { data, loading, called, fetchMore, refetch } = useFeedQuery({
    variables: {
      address: myPubkey,
      offset: 0,
      limit: 25,
    },
  });

  const marketplaceQuery = useMarketplacePreviewQuery({
    variables: {
      subdomain: HOLAPLEX_MARKETPLACE_SUBDOMAIN,
    },
  });

  const allConnectionsFrom = useGetAllConnectionsFromWithTwitter(myPubkey, connection);

  // const myFollowingList: string[] = [];
  const myFollowingList =
    allConnectionsFrom.data?.map((account) => account.account.to.toBase58()) || [];

  const [hasMore, setHasMore] = useState(true);
  // const [feedEvents, setFeedEvents] = useState(data?.feedEvents || []);

  // make sure all feed events are unique
  const feedEvents =
    data?.feedEvents.filter((fe, i) => {
      return data.feedEvents.findIndex((e) => fe.feedEventId === e.feedEventId) === i;
    }) ?? [];

  if (
    // !anchorWallet || will be readded for prod
    !myPubkey
  )
    return null;

  console.log('feed', {
    myPubkey,
    data,
    loading,
    myFollowingList,
  });

  async function loadMore(inView: boolean) {
    console.log('load more feed', {
      inView,
      loading,
      feeedEvetnsN: feedEvents.length,
      // allConnectionsFrom,
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

  function getFeedItems(feedEvents: FeedQuery['feedEvents']): FeedItem[] {
    let skipIndex = 0;
    return feedEvents.reduce((feedItems, event, i) => {
      if (skipIndex > i) return feedItems;
      // const cur = feedEvents[i];
      const nextEvent = feedEvents[i + 1];
      feedItems.push(event);

      if (shouldAggregate(event, nextEvent)) {
        // const eventsAggregated: FeedQueryEvent[] = feedEvents
        //   .slice(i)
        //   .filter((fe, i, arr) => shouldAggregate(fe, arr[i + 1]));
        const eventsAggregated: FeedQueryEvent[] = [feedEvents[i]];
        let j = i + 1;
        while (shouldAggregate(feedEvents[j], feedEvents[j + 1])) {
          eventsAggregated.push(feedEvents[j] as FeedQueryEvent);
          j++;
        }
        eventsAggregated.push(feedEvents[j] as FeedQueryEvent);
        skipIndex = j + 1;

        feedItems.push({
          feedEventId: 'agg_' + event.feedEventId,
          __typename: 'AggregateEvent',
          createdAt: event.createdAt,
          eventsAggregated,
        });
      }

      return feedItems;
    }, [] as FeedItem[]);
  }

  const feedItems = feedEvents; // getFeedItems(feedEvents);

  return (
    <>
      <Head>
        <title>Feed | Holaplex</title>
        <meta
          property="description"
          key="description"
          content="Your personalized feed for all things Holaplex and Solana"
        />
      </Head>

      <div className="space-y-20 xl:max-w-[600px]">
        {loading && (
          <>
            <LoadingFeedCard />
            <LoadingFeedItem />
            <LoadingFeedCard />
          </>
        )}
        {feedItems.length === 0 && <NoFeed />}
        {feedItems.map((fEvent) => (
          <FeedCard
            key={fEvent.feedEventId}
            event={fEvent}
            marketplace={marketplaceQuery.data as Marketplace}
            refetch={refetch}
            myFollowingList={myFollowingList}
          />
        ))}
      </div>
      {hasMore && !loading && feedEvents.length > 0 && (
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

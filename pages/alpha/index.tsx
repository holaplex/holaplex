import { useEffect, useState } from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { useWallet } from '@solana/wallet-adapter-react';
import { FeedQuery, useFeedQuery, useWhoToFollowQuery } from 'src/graphql/indexerTypes';
import { FeedCard, LoadingFeedCard, LoadingFeedItem } from '@/common/components/feed/FeedCard';
import { InView } from 'react-intersection-observer';
import {
  FeedCardAttributes,
  FeedItem,
  FeedQueryEvent,
  generateFeedCardAttributes,
  shouldAggregateFollows,
  shouldAggregateSaleEvents,
  User,
} from '@/common/components/feed/feed.utils';

import Footer, { SmallFooter } from '@/common/components/home/Footer';
import { EmptyStateCTA } from '@/common/components/feed/EmptyStateCTA';
import WhoToFollowList from '@/common/components/feed/WhoToFollowList';
import classNames from 'classnames';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Button5 } from '@/common/components/elements/Button2';
import EmptyFeedCTA from '@/common/components/feed/EmptyFeedCTA';
import { useConnectedWalletProfile } from '@/common/context/ConnectedWalletProfileProvider';

const INFINITE_SCROLL_AMOUNT_INCREMENT = 50;
const AGGREGATE_EVENT_LIMIT = 6;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      address: context.query?.address || null,
    },
  };
};

const AlphaPage = ({ address }: { address: string }) => {
  const { connecting } = useWallet();

  const { connectedProfile } = useConnectedWalletProfile();

  const myPubkey = connectedProfile?.pubkey;
  const feedPubkey = address ?? myPubkey;

  const [showConnectCTA, setShowConnectCTA] = useState(false);

  const {
    data,
    loading,
    called,
    fetchMore,
    refetch: refetchFeed,
  } = useFeedQuery({
    notifyOnNetworkStatusChange: true,
    variables: {
      address: feedPubkey,
      offset: 0,
      limit: INFINITE_SCROLL_AMOUNT_INCREMENT,
    },
    skip: !feedPubkey,
  });
  const feedEvents = data?.feedEvents ?? [];

  const { data: whoToFollowData } = useWhoToFollowQuery({
    variables: { wallet: myPubkey, limit: 25 },
    skip: !myPubkey,
  });
  const profilesToFollow: User[] = (whoToFollowData?.followWallets || []).map((u) => ({
    address: u.address,
    profile: { handle: u.profile?.handle, profileImageUrl: u.profile?.profileImageUrlLowres },
  }));

  // API is returning duplicates for some reason
  const myFollowingList: string[] | undefined = [
    ...new Set(connectedProfile?.following?.map((f) => f.address)),
  ];

  const [hasMoreFeedEvents, setHasMoreFeedEvents] = useState(true);

  // Effect to check connection 2 seconds after loading
  useEffect(() => {
    let timerId: any;
    if (!feedPubkey) {
      timerId = setTimeout(() => {
        if (!feedPubkey) {
          setShowConnectCTA(true);
        }
      }, 2000);
    } else {
      setShowConnectCTA(false);
    }

    return () => clearTimeout(timerId);
  }, [feedPubkey]);

  const { setVisible } = useWalletModal();
  if (showConnectCTA) {
    return (
      <div className=" -mt-32 h-full max-h-screen">
        <div className="container mx-auto -mt-12 -mb-80 flex h-full flex-col items-center justify-center px-6 xl:px-44">
          <EmptyStateCTA
            header="Connect your wallet to view your feed"
            body="Follow your favorite collectors and creators, and get your own personalized feed of activities across the Holaplex ecosystem."
          >
            <Button5 v="primary" loading={connecting} onClick={() => setVisible(true)}>
              Connect
            </Button5>
          </EmptyStateCTA>
        </div>
        <Footer />
      </div>
    );
  }

  async function loadMore(inView: boolean) {
    // console.log('in view', {
    //   inView,
    //   loading,
    //   feedEventsN: feedEvents.length,
    // });
    if (!inView || loading || feedEvents.length <= 0) {
      return;
    }

    await fetchMore({
      variables: {
        address: feedPubkey,
        limit: INFINITE_SCROLL_AMOUNT_INCREMENT,
        offset: feedEvents.length + INFINITE_SCROLL_AMOUNT_INCREMENT,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        const prevFeedEvents = feedEvents; // prev.feedEvents;
        const moreFeedEvents = fetchMoreResult.feedEvents;
        if (moreFeedEvents.length === 0) {
          setHasMoreFeedEvents(false);
        }

        fetchMoreResult.feedEvents = prevFeedEvents.concat(moreFeedEvents);

        return { ...fetchMoreResult };
      },
    });
  }

  // notes
  // observations
  // we will need to do some form of transformation/aggregation of the feedevents from the grapqhl endpoint in order to batch similar evetns on the frontend

  // we could make a transformation and pass the rawEvent together for use in following/ offers

  const feedAttrs: FeedCardAttributes[] = [];
  // will be moved outside of the component eventually
  function getFeedItems(feedEvents: FeedQuery['feedEvents']): FeedItem[] {
    let skipIndex = 0;
    return feedEvents.reduce((feedItems, event, i) => {
      if (
        // remove malformed follow events until we fix it serverside
        (event.__typename === 'FollowEvent' && !event.connection) ||
        // make sure the event is unique // will also be fixed serverside at some point
        feedEvents.slice(i + 1).findIndex((e) => event.feedEventId === e.feedEventId) === i
      ) {
        return feedItems;
      }

      const noAggregation = false;
      if (noAggregation) {
        feedItems.push(event);
        return feedItems;
      }
      // for now we do no aggregation, simply make sure events are valid
      const attrs = generateFeedCardAttributes(event);
      feedAttrs.push(attrs);

      if (skipIndex > i) return feedItems;
      // const cur = feedEvents[i];
      const nextEvent = feedEvents[i + 1];
      const nextNextEvent = feedEvents[i + 2];
      feedItems.push(event);

      // Single person aggregate
      if (shouldAggregateFollows(event, nextEvent, nextNextEvent)) {
        // remove the item that would start the aggregation
        feedItems.pop();
        // const eventsAggregated: FeedQueryEvent[] = feedEvents
        //   .slice(i)
        //   .filter((fe, i, arr) => shouldAggregate(fe, arr[i + 1]));
        const eventsAggregated: FeedQueryEvent[] = [feedEvents[i]];
        let j = i + 1;
        while (shouldAggregateFollows(feedEvents[j], feedEvents[j + 1], feedEvents[j + 2])) {
          eventsAggregated.push(feedEvents[j] as FeedQueryEvent);
          j++;
        }
        eventsAggregated.push(feedEvents[j] as FeedQueryEvent);
        eventsAggregated.push(feedEvents[j + 1] as FeedQueryEvent);
        skipIndex = j + 2;

        feedItems.push({
          feedEventId: `agg_${event.feedEventId}`,
          __typename: 'AggregateEvent',
          createdAt: event.createdAt,
          walletAddress: event.walletAddress,
          profile: event.profile,
          eventsAggregated,
        });
      }

      if (shouldAggregateSaleEvents(event, nextEvent, nextNextEvent)) {
        feedItems.pop();

        const salesAggregated: FeedQueryEvent[] = [feedEvents[i]];
        let k = i + 1;
        let y = k;
        while (shouldAggregateSaleEvents(feedEvents[k], feedEvents[k + 1], feedEvents[k + 2])) {
          salesAggregated.push(feedEvents[k] as FeedQueryEvent);
          k++;
          if (k - y > AGGREGATE_EVENT_LIMIT) {
            break;
          }
        }
        salesAggregated.push(feedEvents[k] as FeedQueryEvent);
        salesAggregated.push(feedEvents[k + 1] as FeedQueryEvent);
        skipIndex = k + 2;

        feedItems.push({
          feedEventId: `agg_${event.feedEventId}`,
          __typename: 'AggregateSaleEvent',
          createdAt: event.createdAt,
          walletAddress: event.walletAddress,
          profile: event.profile,
          eventsAggregated: salesAggregated,
        });
      }

      return feedItems;
    }, [] as FeedItem[]);
  }

  const feedItems = getFeedItems(feedEvents);

  const fetchMoreIndex = feedItems.length - Math.floor(INFINITE_SCROLL_AMOUNT_INCREMENT / 2);

  return (
    <div className="container mx-auto mt-10 px-6 pb-20  xl:px-44  ">
      <div className="mt-12 flex justify-between">
        <div className="mx-auto w-full  sm:w-[600px] xl:mx-0 ">
          <Head>
            <title>Alpha | Holaplex</title>
            <meta
              property="description"
              key="description"
              content="Your personalized feed for all things Holaplex and Solana"
            />
          </Head>

          <div className="space-y-20 ">
            {(!called || loading) && (
              <>
                <LoadingFeedCard />
                <LoadingFeedItem />
                <LoadingFeedCard />
                <LoadingFeedItem />
                <LoadingFeedCard />
              </>
            )}
            {feedEvents.length === 0 && !loading && (
              <EmptyFeedCTA
                myFollowingList={myFollowingList}
                profilesToFollow={profilesToFollow}
                refetch={refetchFeed}
              />
            )}
            {feedItems.map((fEvent, i) => (
              <FeedCard
                key={fEvent.feedEventId + fEvent.walletAddress + i}
                event={fEvent}
                myFollowingList={myFollowingList}
                allEventsRef={feedItems}
              />
            ))}

            {/* Seems to cause duplicate events, need to figure it out */}
            {/*   {feedItems.slice(0, fetchMoreIndex).map((fEvent) => (
              <div key={fEvent.feedEventId} id={fEvent.feedEventId}>
                <FeedCard
                  key={fEvent.feedEventId}
                  event={fEvent}
                  myFollowingList={myFollowingList}
                />
              </div>
            ))} */}

            {/*             <InView threshold={0.1} onChange={loadMore}>
              <div>IN VIEW 1</div>
            </InView> */}
            {/* {feedItems.slice(fetchMoreIndex).map((fEvent, i) => (
              <div key={fEvent.feedEventId} data-i={i} id={fEvent.feedEventId}>
                <FeedCard
                  key={fEvent.feedEventId}
                  event={fEvent}
                  myFollowingList={myFollowingList}
                />
              </div>
            ))} */}
            {hasMoreFeedEvents && loading && feedItems.length > 0 && (
              <>
                <LoadingFeedCard />
                <LoadingFeedItem />
                <LoadingFeedCard />
              </>
            )}
            {/* In case you manage to jump over the midway loadpoint */}
            <InView threshold={0.1} onChange={loadMore}></InView>
          </div>
          {/*       {!hasMoreFeedEvents && (
              <EmptyStateCTA header="No more events to load">
                <Button5
                  v="primary"
                  onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
                >
                  Back to top
                </Button5>
              </EmptyStateCTA>
            )} */}
        </div>
        <div className="sticky top-10 ml-20 hidden h-fit w-full max-w-sm  xl:block ">
          <WhoToFollowList myFollowingList={myFollowingList} profilesToFollow={profilesToFollow} />
          {/* <MyActivityList /> */}
          {/*     <TestFeeds /> */}
          <div className="relative  py-10 ">
            <div className="absolute  inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-800" />
            </div>
          </div>
          <SmallFooter />
        </div>
        <BackToTopBtn />
      </div>
    </div>
  );
};

export default AlphaPage;

/* 
Might reintorduce this with Tabs later
AlphaPage.getLayout = function getLayout(page: ReactElement) {
  return <FeedLayout>{page}</FeedLayout>;
};
 */

function BackToTopBtn() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
      className={classNames(
        'fixed right-8 bottom-8 rounded-full bg-gray-900 p-4',
        scrollY === 0 && 'hidden'
      )}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.99935 12.8332V1.1665M6.99935 1.1665L1.16602 6.99984M6.99935 1.1665L12.8327 6.99984"
          stroke="white"
          strokeWidth="1.67"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

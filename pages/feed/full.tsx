import { Button5 } from '@/common/components/elements/Button2';
import { EmptyStateCTA } from '@/common/components/feed/EmptyStateCTA';
import { FeedCard } from '@/common/components/feed/FeedCard';
import { LoadingFeedCard, LoadingFeedItem } from '@/common/components/feed/LoadingFeed';
import NoFeed from '@/common/components/feed/NoFeed';
import WhoToFollowList from '@/common/components/feed/WhoToFollowList';
import { SmallFooter } from '@/common/components/home/Footer';
import { HOLAPLEX_MARKETPLACE_SUBDOMAIN } from '@/common/constants/marketplace';
import { useGetAllConnectionsFromWithTwitter } from '@/common/hooks/useGetAllConnectionsFrom';
import { Marketplace } from '@holaplex/marketplace-js-sdk';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { Footer } from 'antd/lib/layout/layout';
import classNames from 'classnames';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { InView } from 'react-intersection-observer';
import { TailSpin } from 'react-loader-spinner';
import { useFeedQuery, useMarketplacePreviewQuery } from 'src/graphql/indexerTypes';

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      address: context.query?.address || null,
    },
  };
};

// test page to test without layout

const INFINITE_SCROLL_AMOUNT_INCREMENT = 5;

export default function FullPage({ address }: { address: string }) {
  const anchorWallet = useAnchorWallet();

  const { connection } = useConnection();
  const myPubkey = address ?? anchorWallet?.publicKey.toBase58() ?? null;
  const { data, loading, called, fetchMore, refetch } = useFeedQuery({
    variables: {
      address: myPubkey,
      offset: 0,
      limit: 25,
    },
  });

  /*   useEffect(() => {
    const interval = setInterval(() => {
      refetch().then((res) => res.data);
    }, 30_000);

    return () => {
      clearInterval(interval);
    };
  }, []); */

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
  if (!anchorWallet) {
    return <NoFeed />;
  }

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

  if (!anchorWallet) {
    return (
      <div className=" -mt-32 h-full max-h-screen">
        <div className="container mx-auto -mt-12 -mb-80 flex h-full flex-col items-center justify-center px-6 xl:px-44">
          <EmptyStateCTA
            header="Connect your wallet to view your feed"
            body="Follow your favorite collectors and creators, and get your own personalized feed of activities across the Holaplex ecosystem."
          />
        </div>
        <Footer />
      </div>
    );
  }

  const feedItems = feedEvents; // getFeedItems(feedEvents);

  return (
    <div className="container mx-auto mt-10 px-6 pb-20  xl:px-44  ">
      <Head>
        <title>Feed | Holaplex</title>
        <meta
          property="description"
          key="description"
          content="Your personalized feed for all things Holaplex and Solana"
        />
      </Head>
      <div className="mt-12 flex justify-between">
        <div className="mx-auto w-full  sm:w-[600px] xl:mx-0 ">
          {/* <div className="flex space-x-1   p-1">
              <Tab title={'Feed'} selected={feedTabSelected} url="/feed" />
              <Tab title={'Discovery'} selected={!feedTabSelected} url="/feed/discovery" />
            </div> */}
          <div className="space-y-20 ">
            {loading && (
              <>
                <LoadingFeedCard />
                <LoadingFeedItem />
                <LoadingFeedCard />
              </>
            )}
            {feedItems.length === 0 && !loading && <NoFeed />}
            {feedItems.map((fEvent) => (
              <FeedCard
                key={fEvent.feedEventId}
                event={fEvent}
                marketplace={marketplaceQuery.data as Marketplace}
                refetch={refetch}
                myFollowingList={myFollowingList}
              />
            ))}
            {/*       {!hasMore && (
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
          {hasMore && !loading && feedEvents.length > 0 && (
            <div>
              <InView threshold={0.1} onChange={loadMore}>
                <div className={`my-6 flex w-full items-center justify-center font-bold`}>
                  <TailSpin height={50} width={50} color={`grey`} ariaLabel={`loading-nfts`} />
                </div>
              </InView>
            </div>
          )}
        </div>
        <div className="sticky top-10 ml-20 hidden h-fit w-full max-w-sm  xl:block ">
          <WhoToFollowList />
          {/* <MyActivityList /> */}
          {/* <div>
              <div className="mb-6 flex items-center justify-between border-b border-gray-800 pb-4">
                <h3 className="m-0 text-base font-medium text-white">
                  Test feeds (click to view their feeds){' '}
                </h3>
              </div>
  
              <div className="space-y-4">
                {TEST_FEEDS.map((u) => (
                  // <FollowListItem key={p.handle} profile={p} />
                  <div key={u.address} className="flex items-center space-x-4">
                    <ProfilePFP user={u} />
                    <Link passHref href={'/feed?address=' + u.address}>
                      <a className="">
                        <span>{u.handle}</span>
                      </a>
                    </Link>
                  </div>
                ))}
              </div>
            </div> */}
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
}

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

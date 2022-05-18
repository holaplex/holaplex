import { ArrowRightIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import { HomeSectionCarousel } from 'pages/home-v2-wip';
import React from 'react';
import { useFeedQuery } from 'src/graphql/indexerTypes';
import { Button5 } from '../elements/Button2';
import { FeedQueryEvent } from '../feed/feed.utils';
import { FeedCard, LoadingFeedCard } from '../feed/FeedCard';
import Marquee from 'react-fast-marquee';

const ALPHA_WALLET = 'NWswq7QR7E1i1jkdkddHQUFtRPihqBmJ7MfnMCcUf4H';

export default function HeroSection() {
  const { data } = useFeedQuery({
    variables: {
      address: ALPHA_WALLET,
      offset: 0,
      limit: 25,
    },
  });
  const feedEvents = data?.feedEvents || [];
  const feedItems: FeedQueryEvent[] = [];

  feedEvents.forEach((event) => {
    if (
      event.__typename !== 'FollowEvent' &&
      !feedItems.find((i) => i.feedEventId === event.feedEventId)
    ) {
      feedItems.push(event);
    }
  });

  return (
    <div className="">
      <Marquee speed={40} gradient={false} pauseOnHover={true}>
        <div className="grid grid-flow-col gap-8 overflow-x-scroll py-2 pl-8 no-scrollbar  ">
          {feedItems.slice(0, 12).map((fi) => (
            <div className="w-96 flex-shrink-0" key={fi.feedEventId}>
              <FeedCard
                options={{ hideAction: true }}
                event={fi}
                myFollowingList={[]}
                key={fi.feedEventId}
              />
            </div>
          ))}
        </div>
      </Marquee>

      <div className="mt-20 flex flex-col items-center text-center">
        <h1 className="text-3xl font-medium">
          Every NFT on Solana. Every wallet is a store. Everyone welcome.
        </h1>
        <Link href="/alpha">
          <a className="mt-10">
            <Button5 className="!py-3 !px-6 !text-2xl !font-medium" v="primary">
              Get started with Alpha <ArrowRightIcon className="ml-3 h-8 w-8" />
            </Button5>
          </a>
        </Link>
      </div>
    </div>
  );
}

function LoadingRow() {
  return Array(12)
    .fill(null)
    .map((_, i) => (
      <div key={i} className="w-96">
        <LoadingFeedCard />
      </div>
    ));
}

import { ArrowRightIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import React, { useEffect, useState, useMemo } from 'react';
import { useFeedQuery } from 'src/graphql/indexerTypes';
import { Button5 } from '../elements/Button2';
import { FeedQueryEvent } from '../feed/feed.utils';
import { FeedCard, LoadingFeedCard } from '../feed/FeedCard';
import Marquee from 'react-fast-marquee';
import classNames from 'classnames';

const ALPHA_WALLET = 'ALphA7iWKMUi8owfbSKFm2i3BxG6LbasYYXt8sP85Upz'; // backup 'NWswq7QR7E1i1jkdkddHQUFtRPihqBmJ7MfnMCcUf4H';
const N_ITEMS = 12;

export default function HeroSection() {
  const { data, loading } = useFeedQuery({
    variables: {
      address: ALPHA_WALLET,
      offset: 0,
      limit: N_ITEMS,
      excludeTypes: ['follow'],
    },
  });
  const feedEvents = useMemo(() => data?.feedEvents || [], [data?.feedEvents]);
  const feedItems: FeedQueryEvent[] = useMemo(() => feedEvents.slice(0, N_ITEMS), [feedEvents]);

  return (
    <div className="">
      <div className="relative h-[450px] ">
        <Marquee speed={feedItems.length ? 40 : 0} gradient={false} pauseOnHover={true}>
          <div
            className={classNames(
              'grid grid-flow-col gap-8 overflow-x-scroll py-2 pl-8 no-scrollbar'
            )}
          >
            {feedItems.map((fi, i) => (
              <div className="w-96 flex-shrink-0" key={i}>
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
        {!feedEvents.length && (
          <div
            className={classNames(
              ' absolute inset-0  grid grid-flow-col gap-8 overflow-x-scroll py-2 pl-8 no-scrollbar'
            )}
          >
            {Array(N_ITEMS)
              .fill(null)
              .map((_, i) => (
                <div className="w-96 flex-shrink-0 " key={i}>
                  <LoadingFeedCard />
                </div>
              ))}
          </div>
        )}
      </div>

      <div className="mt-20 flex flex-col items-center text-center">
        <h1 className="text-3xl font-medium">
          Every NFT on Solana. Every wallet is a store. Everyone is welcome.
        </h1>
        <Link href="/alpha">
          <a className="mt-10">
            <Button5 className="!py-3 !px-6 !text-2xl !font-medium" v="primary">
              Get started <ArrowRightIcon className="ml-3 h-8 w-8" />
            </Button5>
          </a>
        </Link>
      </div>
    </div>
  );
}

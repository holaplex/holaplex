import { ArrowRightIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import React from 'react';
import { Button5 } from '../../components/Button2';
import { FeedItem } from '../alpha/feed.utils';
import { FeedCard, LoadingFeedCard } from '../alpha/FeedCard';
import Marquee from 'react-fast-marquee';
import classNames from 'classnames';
import { QueryContext } from '@/hooks/useGraphQLQueryWithTransform';

const N_ITEMS = 12;

export type HeroSectionData = FeedItem[];

export interface HeroSectionProps {
  context: QueryContext<HeroSectionData>
}

export function HeroSection(props: HeroSectionProps): JSX.Element {
  const feedEvents: FeedItem[] = props.context.data ?? [];

  return (
    <div>
      <div className="relative h-[450px]">
        <Marquee speed={feedEvents.length ? 40: 0} gradient={false} pauseOnHover={true}>
          <div
            className={classNames(
              'grid grid-flow-col gap-8 overflow-x-scroll py-2 pl-8 no-scrollbar'
            )}
          >
            {feedEvents.map((fi, i) => (
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

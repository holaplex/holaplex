import WhoToFollowList from './WhoToFollowList';
import { Tab } from '@headlessui/react';
import classNames from 'classnames';
import FollowingFeed from './FollowingFeed';
import { useActivityPageQuery } from 'src/graphql/indexerTypes';
import { useMemo } from 'react';
import { getActivityItemsFromBids } from '../elements/ActivityContent';
import { ActivityCard } from '../elements/ActivityCard';
import Link from 'next/link';

function DiscoveryFeed() {
  return <div>DiscoveryFeed</div>;
}

function MyActivityList() {
  const mypubkey = 'NWswq7QR7E1i1jkdkddHQUFtRPihqBmJ7MfnMCcUf4H';
  const activityPage = useActivityPageQuery({
    variables: {
      address: mypubkey,
    },
  });

  const isLoading = activityPage.loading;

  const activityItems = useMemo(
    () =>
      activityPage.data?.wallet?.bids
        ? // @ts-ignore
          getActivityItemsFromBids(activityPage.data.wallet.bids!)
        : [],

    [activityPage.data?.wallet?.bids]
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between border-b border-gray-800 pb-4">
        <h3 className="m-0 text-base font-medium text-white">Your activity</h3>
        <Link href={`/profiles/${mypubkey}/activity`} passHref>
          <a className="text-base text-gray-300">See more</a>
        </Link>
      </div>
      <div className="space-y-4">
        {activityItems.slice(0, 3).map((item) => (
          <ActivityCard activity={item} key={item.id} />
        ))}
      </div>
    </div>
  );
}

function ProfileCard() {
  // expanded = true / false
}

function BackToTopBtn() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
      className="absolute right-8 bottom-8 rounded-full bg-gray-900"
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

type FeedType = 'Following' | 'Discovery';
const Feeds: FeedType[] = ['Following', 'Discovery'];

export default function FeedContainer() {
  const myPubkey: string = '';

  const mode: FeedType = 'Following';

  return (
    <div className="mt-12 flex justify-between">
      <div className="w-full max-w-3xl">
        <Tab.Group>
          <Tab.List className="flex space-x-1   p-1">
            {Feeds.map((f) => (
              <Tab
                key={f}
                className={({ selected }) =>
                  classNames(
                    'w-full  py-2.5 text-sm font-medium text-white ',
                    selected ? 'border-b border-white' : 'text-gray-300  hover:text-white'
                  )
                }
              >
                {f}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-2">
            <Tab.Panel
              key={0}
              className={classNames(
                'rounded-xl  p-3',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
              )}
            >
              <FollowingFeed />
            </Tab.Panel>

            <Tab.Panel
              key={1}
              className={classNames(
                'rounded-xl bg-white p-3',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
              )}
            >
              <DiscoveryFeed />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
      <div className="mt-10 w-full max-w-md space-y-7">
        <WhoToFollowList />
        <MyActivityList />
      </div>
      <BackToTopBtn />
    </div>
  );
}

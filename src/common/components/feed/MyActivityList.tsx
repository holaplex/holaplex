import { IFeedItem } from '@/modules/feed/feed.interfaces';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { useActivityPageQuery, useFeedQuery } from 'src/graphql/indexerTypes';
import { ActivityCard } from '../elements/ActivityCard';
import { getActivityItemsFromBids } from '../elements/ActivityContent';
import { generateFeedCardAttributes } from './feed.utils';

export function MyActivityList() {
  const anchorWallet = useAnchorWallet();
  const myPubkey = anchorWallet?.publicKey.toBase58();

  const activityPage = useActivityPageQuery({
    variables: {
      address: myPubkey,
    },
  });

  const isLoading = activityPage.loading;

  // const { data, loading, called, refetch } = useFeedQuery({
  //   // fetchPolicy: `cache-and-network`,
  //   fetchPolicy: 'no-cache',
  //   variables: {
  //     address: myPubkey,
  //   },
  // });

  // const myFeedItems = useMemo(
  //   () =>
  //     activityPage.data?.wallet?.bids
  //       ? // @ts-ignore
  //         data?.feedEvents
  //           .map((e) => generateFeedCardAttributes(e))
  //           .filter((a) => a?.sourceUser.address === myPubkey)
  //       : [],

  //   [data?.feedEvents]
  // );

  // const myFeedActivityItems: IFeedItem[] = myFeedItems.map((i) => ({
  //   id: i?.id,
  //   timestamp: i?.createdAt,
  //   type: i?.type,
  //   sourceUser: i?.sourceUser,
  //   nft: i?.nft,
  //   solAmount: i?.solAmount,
  // }));

  const activityItems = useMemo(
    () =>
      activityPage.data?.wallet?.bids
        ? // @ts-ignore
          getActivityItemsFromBids(activityPage.data.wallet.bids!)
        : [],

    [activityPage.data?.wallet?.bids]
  );

  // console.log('My activity', {
  //   myFeedItems,
  //   myFeedActivityItems,
  //   activityItems,
  // });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between border-b border-gray-800 pb-4">
        <h3 className="m-0 text-base font-medium text-white">Your activity</h3>
        <Link href={`/profiles/${myPubkey}/activity`} passHref>
          <a className="text-base text-gray-300">See more</a>
        </Link>
      </div>
      <div className="space-y-4">
        {activityItems
          // .concat(myFeedActivityItems)
          .slice(0, 3)
          .map((item: any) => (
            <ActivityCard activity={item} key={item.id} />
          ))}
      </div>
    </div>
  );
}

import Link from 'next/link';
import { useMemo } from 'react';
import { useActivityPageQuery } from 'src/graphql/indexerTypes';
import { ActivityCard } from '../elements/ActivityCard';
import { getActivityItemsFromBids } from '../elements/ActivityContent';

export function MyActivityList() {
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
        {activityItems.slice(0, 3).map((item: any) => (
          <ActivityCard activity={item} key={item.id} />
        ))}
      </div>
    </div>
  );
}

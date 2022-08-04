import {
  CollectionPageProps,
  getCollectionPageServerSideProps,
} from '@/views/collections/collections.utils';

import CollectionLayout from 'src/views/collections/CollectionLayout';
import { InView } from 'react-intersection-observer';

import { GetServerSideProps } from 'next';

import { uniq } from 'ramda';
import React, { FC, ReactNode, useState } from 'react';
import { NftActivity, useCollectionActivitiesQuery } from 'src/graphql/indexerTypes';
import TopLevelFilterButton from 'src/components/TopLevelFilterButton';
import clsx from 'clsx';
import NoProfileItems, { NoProfileVariant } from '../../../components/NoProfileItems';
import { ApolloQueryResult, OperationVariables } from '@apollo/client';
import { None } from '../../../components/OfferForm';
import { TailSpin } from 'react-loader-spinner';
import { format } from 'timeago.js';
import Link from 'next/link';
import { DollarSign, Tag } from 'react-feather';
import { DisplaySOL } from '../../../components/CurrencyHelpers';
import { Avatar } from '../../../components/Avatar';
import { HandIcon } from '@heroicons/react/outline';
import { shortenAddress } from '../../../modules/utils/string';

export const getServerSideProps: GetServerSideProps<CollectionPageProps> =
  getCollectionPageServerSideProps;

export const LoadingActivityCard = () => {
  return <article className="mb-4 h-16 rounded bg-gray-800" />;
};

export const ActivityCard = ({
  activity: a,
  refetch,
  loading = false,
}: {
  activity: NftActivity;
  refetch:
    | ((variables?: Partial<OperationVariables> | undefined) => Promise<ApolloQueryResult<None>>)
    | (() => void);
  loading: boolean;
}) => {
  if (loading) return <LoadingActivityCard />;
  const multipleWallets = a.wallets.length > 1;
  return (
    <article key={a.id} className="mb-4 grid grid-cols-8 rounded border border-gray-700 p-4">
      <Link href={`/nfts/${a.nft?.address}`} passHref>
        <a className="col-span-2 flex items-center gap-4">
          <img className="h-12 w-12 rounded-lg object-cover" src={a.nft?.image} alt="nft" />
          <div className="font-medium">{a.nft?.name}</div>
        </a>
      </Link>
      <div className="flex items-center">
        {a.activityType === 'purchase' && (
          <DollarSign className="mr-2 h-5 w-5 self-center text-gray-300" />
        )}
        <div>{a.activityType === 'purchase' && 'Sold'}</div>
        {a.activityType === 'offer' && (
          <HandIcon className="mr-2 h-5 w-5 self-center text-gray-300" />
        )}
        <div>{a.activityType === 'offer' && 'Offer'}</div>
        {a.activityType === 'listing' && <Tag className="mr-2 h-5 w-5 self-center text-gray-300" />}
        <div>{a.activityType === 'listing' && 'Listing'}</div>
      </div>
      <div className="flex items-center text-xs">{shortenAddress(a.marketplaceProgramAddress)}</div>
      <div
        className={clsx('col-span-2 flex items-center justify-center self-center ', {
          '-ml-6': multipleWallets,
        })}
      >
        {multipleWallets && (
          <img src="/images/uturn.svg" className="mr-2 w-4 text-gray-300" alt="wallets" />
        )}
        <div className="flex flex-col">
          <Link href={`/profiles/${a.wallets[0].address}`} passHref>
            <a>
              <Avatar
                border
                address={a.wallets[0].address}
                data={{
                  twitterHandle: a.wallets[0].profile?.handle,
                  pfpUrl: a.wallets[0]?.profile?.profileImageUrlLowres,
                }}
              />
            </a>
          </Link>
          {multipleWallets && (
            <Link href={`/profiles/${a.wallets[1].address}`} passHref>
              <a>
                <Avatar
                  border
                  address={a.wallets[1].address}
                  data={{
                    twitterHandle: a.wallets[1].profile?.handle,
                    pfpUrl: a.wallets[1]?.profile?.profileImageUrlLowres,
                  }}
                />
              </a>
            </Link>
          )}
        </div>
      </div>
      <div className="self-center">
        <DisplaySOL amount={a.price.toNumber()} iconVariant="large" className="py-2 text-base" />
      </div>
      <div className="self-center text-base">{format(a.createdAt, 'en_US')}</div>
    </article>
  );
};

interface NFTGridProps {
  activities: NftActivity[];
  ctaVariant?: NoProfileVariant;
  refetch: (
    variables?: Partial<OperationVariables> | undefined
  ) => Promise<ApolloQueryResult<None>>;
  onLoadMore: (inView: boolean, entry: IntersectionObserverEntry) => Promise<void>;
  hasMore: boolean;
  showCollection?: boolean;
  loading?: boolean;
}

export const NFTGrid: FC<NFTGridProps> = ({
  activities,
  refetch,
  onLoadMore,
  hasMore,
  ctaVariant,
  showCollection,
  loading = false,
}) => {
  return (
    <>
      <div className="flex flex-col">
        <header className="mb-2 grid grid-cols-8 px-4">
          <span className="col-span-2 text-base text-gray-300 ">Item</span>
          <span className="text-base text-gray-300">Event</span>
          <span className="text-base text-gray-300">Marketplace</span>
          <span className="col-span-2 flex justify-center text-base text-gray-300">Parties</span>
          <span className="text-base text-gray-300">Amount</span>
          <span className="text-base text-gray-300">Date</span>
        </header>
        {loading ? (
          <>
            <LoadingActivityCard />
            <LoadingActivityCard />
            <LoadingActivityCard />
            <LoadingActivityCard />
          </>
        ) : (
          <>
            {activities.length === 0 ? (
              <div className={`col-span-full`}>
                <NoProfileItems variant={ctaVariant} />
              </div>
            ) : (
              activities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  refetch={refetch}
                  loading={loading}
                />
              ))
            )}
          </>
        )}
      </div>
      {hasMore && (
        <InView as="div" threshold={0.1} onChange={onLoadMore}>
          <div className={`my-6 flex w-full items-center justify-center font-bold`}>
            <TailSpin height={50} width={50} color={`grey`} ariaLabel={`loading-nfts`} />
          </div>
        </InView>
      )}
    </>
  );
};

export const INFINITE_SCROLL_AMOUNT_INCREMENT = 25;
export const INITIAL_FETCH = 25;

export default function CollectionNFTsPage(props: CollectionPageProps) {
  enum SelectedFilter {
    ALL_EVENTS,
    LISTINGS,
    OFFERS,
    SALES,
    TRANSFERS,
  }

  const [selectedFilter, setSelectedFilter] = useState(SelectedFilter.ALL_EVENTS);
  const [hasMore, setHasMore] = useState(true);

  const variables = {
    collectionMintAddress: props.collection?.mintAddress!,
    limit: INITIAL_FETCH,
    offset: 0,
    eventTypes: null,
  };

  const { data, loading, fetchMore, refetch } = useCollectionActivitiesQuery({
    variables,
  });

  // Note: unique check to backup indexer
  const activities = data?.collection?.activities || [];

  return (
    <div className="mt-10">
      <div
        className={`sticky top-0 z-10 flex flex-col items-center gap-6 bg-gray-900 bg-opacity-80 py-4 backdrop-blur-sm lg:flex-row lg:justify-between lg:gap-4`}
      >
        <div className={`mx-4 flex w-full items-center justify-between gap-4`}>
          <div className="text-2xl text-white">Activity</div>
          <div className="flex justify-end gap-4">
            <TopLevelFilterButton
              title={`All events`}
              onClick={async () => {
                setSelectedFilter(SelectedFilter.ALL_EVENTS);
                await refetch({
                  ...variables,
                  eventTypes: null,
                });
              }}
              selected={selectedFilter === SelectedFilter.ALL_EVENTS}
            />

            <TopLevelFilterButton
              title={`Listings`}
              onClick={async () => {
                setSelectedFilter(SelectedFilter.LISTINGS);
                await refetch({ ...variables, eventTypes: ['LISTINGS'] });
              }}
              selected={selectedFilter === SelectedFilter.LISTINGS}
            />

            <TopLevelFilterButton
              title={`Offers`}
              onClick={async () => {
                setSelectedFilter(SelectedFilter.OFFERS);
                await refetch({ ...variables, eventTypes: ['OFFERS'] });
              }}
              selected={selectedFilter === SelectedFilter.OFFERS}
            />

            <TopLevelFilterButton
              title={`Sales`}
              onClick={async () => {
                setSelectedFilter(SelectedFilter.SALES);
                await refetch({ ...variables, eventTypes: ['PURCHASES'] });
              }}
              selected={selectedFilter === SelectedFilter.SALES}
            />

            {/* <TopLevelFilterButton
              title={`Transfers`}
              onClick={async () => {
                setSelectedFilter(SelectedFilter.TRANSFERS);
                await refetch({ ...variables, eventTypes: ['TRANSFERS'] });
              }}
              selected={selectedFilter === SelectedFilter.TRANSFERS}
            /> */}
          </div>
        </div>
      </div>

      <div className="mt-20 w-full">
        <NFTGrid
          showCollection={false}
          ctaVariant={`activity`}
          hasMore={hasMore && activities.length > INITIAL_FETCH - 1}
          onLoadMore={async (inView: boolean) => {
            if (!inView || loading || activities.length <= 0) {
              return;
            }

            const { data: newData } = await fetchMore({
              variables: {
                ...variables,
                limit: INFINITE_SCROLL_AMOUNT_INCREMENT,
                offset:
                  activities.length > INFINITE_SCROLL_AMOUNT_INCREMENT
                    ? activities.length
                    : INFINITE_SCROLL_AMOUNT_INCREMENT,
              },
              updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prev;
                const prevActivities = prev.collection?.activities || [];
                const moreActivities = fetchMoreResult.collection?.activities || [];
                if (!moreActivities.length) {
                  setHasMore(false);
                }

                fetchMoreResult.collection!.activities = [...prevActivities, ...moreActivities];

                return { ...fetchMoreResult };
              },
            });
          }}
          activities={uniq(activities) as NftActivity[]}
          refetch={refetch}
          loading={loading}
        />
      </div>
    </div>
  );
}

CollectionNFTsPage.getLayout = function getLayout(
  collectionPageProps: CollectionPageProps & { children: ReactNode }
) {
  return (
    <CollectionLayout {...collectionPageProps}>{collectionPageProps.children}</CollectionLayout>
  );
};

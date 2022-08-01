import { GetServerSideProps, NextPage } from 'next';
import React, { useMemo, useState } from 'react';
import { CreatedNfTsQuery, useCreatedNfTsQuery } from '@/graphql/indexerTypes';
import {
  getProfileServerSideProps,
  WalletDependantPageProps,
} from '@/views/profiles/getProfileServerSideProps';
//@ts-ignore
import FeatherIcon from 'feather-icons-react';
import clsx from 'clsx';
import { DoubleGrid } from '@/assets/icons/DoubleGrid';
import { TripleGrid } from '@/assets/icons/TripleGrid';
import { ProfileDataProvider } from '@/views/profiles/ProfileDataProvider';
import TextInput2 from 'src/components/TextInput2';
import { INFINITE_SCROLL_AMOUNT_INCREMENT, INITIAL_FETCH, NFTGrid } from './nfts';
import { HOLAPLEX_MARKETPLACE_SUBDOMAIN } from '@/views/_global/holaplexConstants';
import { Marketplace } from '@holaplex/marketplace-js-sdk';
import { isEmpty, uniq } from 'ramda';
import ProfileLayout from '@/views/profiles/ProfileLayout';
import { GridSize } from '@/components/GridSelector';

type CreatedNFT = CreatedNfTsQuery['nfts'][0];

export const getServerSideProps: GetServerSideProps<WalletDependantPageProps> = async (context) =>
  getProfileServerSideProps(context);

enum ListingFilters {
  ALL,
  LISTED,
  UNLISTED,
}

const CreatedNFTs = (props: WalletDependantPageProps) => {
  const { publicKey } = props;
  const [listedFilter, setListedFilter] = useState<ListingFilters>(ListingFilters.ALL);
  const [searchFocused, setSearchFocused] = useState(false);
  const [gridView, setGridView] = useState<GridSize>('4x4');
  const variables = {
    subdomain: HOLAPLEX_MARKETPLACE_SUBDOMAIN,
    creator: publicKey,
    limit: INITIAL_FETCH,
    offset: 0,
  };
  const createdNFTs = useCreatedNfTsQuery({
    variables: variables,
  });
  const nfts = createdNFTs?.data?.nfts || [];
  const loading = createdNFTs.loading;
  const marketplace = createdNFTs?.data?.marketplace;
  const refetch = createdNFTs.refetch;
  const fetchMore = createdNFTs.fetchMore;
  const [hasMore, setHasMore] = useState(true);

  const [query, setQuery] = useState('');

  const nftsToShow =
    query === ''
      ? nfts
      : nfts.filter((nft) => nft.name.toLowerCase().includes(query.toLowerCase()));

  const listedNfts = useMemo(
    () => nftsToShow.filter((nft) => nft.listings.length > 0),
    [nftsToShow]
  );
  const unlistedNfts = useMemo(
    () => nftsToShow.filter((nft) => nft.listings.length <= 0),
    [nftsToShow]
  );

  const totalCount = useMemo(() => nftsToShow.length, [nftsToShow]);
  const listedCount = useMemo(
    () => listedNfts?.reduce((acc, nft) => acc + nft.listings.filter((o) => o).length, 0) || 0,
    [listedNfts]
  );

  const unlistedCount = useMemo(() => unlistedNfts.length || 0, [unlistedNfts]);

  // Note: unique check to cover indexer duplicates
  const filteredNfts =
    listedFilter === ListingFilters.ALL
      ? nftsToShow
      : listedFilter === ListingFilters.LISTED
      ? listedNfts
      : listedFilter === ListingFilters.UNLISTED
      ? unlistedNfts
      : nftsToShow;

  const ListingFilter = ({
    filterToCheck,
    count = 0,
    title,
  }: {
    count: number;
    title: string;
    filterToCheck: ListingFilters;
  }) => {
    return (
      <div
        onClick={() => setListedFilter(filterToCheck)}
        className={`flex w-28 flex-row items-center justify-center gap-2 rounded-full p-2 font-medium ${
          listedFilter === filterToCheck
            ? `bg-gray-800`
            : `cursor-pointer border border-gray-800 bg-gray-900 text-gray-300 hover:bg-gray-800`
        }`}
      >
        <p className={`mb-0 first-letter:text-base`}>{title}</p>
      </div>
    );
  };

  const GridSelector = () => {
    return (
      <div className="ml-4 hidden rounded-lg border-2 border-solid border-gray-800 md:flex">
        <button
          className={clsx('flex w-10 items-center justify-center', {
            'bg-gray-800': gridView === '2x2',
          })}
          onClick={() => setGridView('2x2')}
        >
          <DoubleGrid
            className={gridView !== '2x2' ? 'transition hover:scale-110 ' : ''}
            color={gridView === '2x2' ? 'white' : '#707070'}
          />
        </button>

        <button
          className={clsx('flex w-10 items-center justify-center', {
            'bg-gray-800': gridView === '4x4',
          })}
          onClick={() => setGridView('4x4')}
        >
          <TripleGrid
            className={gridView !== '4x4' ? 'transition hover:scale-110' : ''}
            color={gridView === '4x4' ? 'white' : '#707070'}
          />
        </button>
      </div>
    );
  };

  return (
    <>
      <div
        className={clsx(
          'sticky top-0 z-10 flex flex-col items-center gap-6 bg-gray-900 py-4',
          'lg:flex-row lg:justify-between lg:gap-4'
        )}
      >
        <div className={`flex w-full justify-start gap-4 lg:items-center`}>
          <ListingFilter title={`All`} filterToCheck={ListingFilters.ALL} count={totalCount} />
          <ListingFilter
            title={`Listed`}
            filterToCheck={ListingFilters.LISTED}
            count={listedCount}
          />
          <ListingFilter
            title={`Unlisted`}
            filterToCheck={ListingFilters.UNLISTED}
            count={unlistedCount}
          />
        </div>
        <div className={`flex w-full lg:justify-end`}>
          <TextInput2
            id="owned-search"
            label="owned search"
            hideLabel
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            leadingIcon={
              <FeatherIcon
                icon="search"
                aria-hidden="true"
                className={searchFocused ? 'text-white' : 'text-gray-500'}
              />
            }
            placeholder="Search"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <GridSelector />
        </div>
      </div>
      <NFTGrid
        ctaVariant={'created'}
        hasMore={hasMore && filteredNfts.length > INITIAL_FETCH - 1}
        onLoadMore={async (inView) => {
          if (!inView || loading || filteredNfts.length <= 0) {
            return;
          }

          const { data: newData } = await fetchMore({
            variables: {
              ...variables,
              limit: INFINITE_SCROLL_AMOUNT_INCREMENT,
              offset:
                nftsToShow.length > INFINITE_SCROLL_AMOUNT_INCREMENT
                  ? nftsToShow.length
                  : INFINITE_SCROLL_AMOUNT_INCREMENT,
            },
            updateQuery: (prev, { fetchMoreResult }) => {
              if (!fetchMoreResult) return prev;
              const prevNfts = prev.nfts;
              const moreNfts = fetchMoreResult.nfts;

              if (isEmpty(moreNfts)) {
                setHasMore(false);
              }

              fetchMoreResult.nfts = [...prevNfts, ...moreNfts];

              return { ...fetchMoreResult };
            },
          });
        }}
        nfts={uniq(filteredNfts)}
        gridView={gridView}
        refetch={refetch}
        loading={createdNFTs.loading}
        marketplace={marketplace as Marketplace}
      />
    </>
  );
};

export default CreatedNFTs;

CreatedNFTs.getLayout = function getLayout(
  profileData: WalletDependantPageProps & { children: JSX.Element }
): JSX.Element {
  return (
    <ProfileDataProvider profileData={profileData}>
      <ProfileLayout profileData={profileData}>{profileData.children}</ProfileLayout>
    </ProfileDataProvider>
  );
};

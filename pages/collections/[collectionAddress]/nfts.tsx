import {
  CollectionPageProps,
  getCollectionPageServerSideProps,
} from '@/common/components/collections/collections.utils';

import { HOLAPLEX_MARKETPLACE_SUBDOMAIN } from '@/common/constants/marketplace';
import CollectionLayout from '@/layouts/CollectionLayout';
//@ts-ignore
import FeatherIcon from 'feather-icons-react';
import { GetServerSideProps } from 'next';
import {
  INFINITE_SCROLL_AMOUNT_INCREMENT,
  INITIAL_FETCH,
  NFTGrid,
} from 'pages/profiles/[publicKey]/nfts';
import { uniq } from 'ramda';
import React, { ReactNode, useState } from 'react';
import { useNftsInCollectionQuery } from 'src/graphql/indexerTypes';
import GridSelector from '@/components/elements/GridSelector';
import TextInput2 from '@/components/elements/TextInput2';
import TopLevelFilterButton from '@/components/elements/TopLevelFilterButton';

export const getServerSideProps: GetServerSideProps<CollectionPageProps> =
  getCollectionPageServerSideProps;

export default function CollectionNFTsPage(props: CollectionPageProps) {
  enum SelectedFilter {
    ALL,
    LISTED,
    UNLISTED,
  }

  // search
  const [searchFocused, setSearchFocused] = useState(false);
  const [query, setQuery] = useState('');

  // grid
  const [gridView, setGridView] = useState<'1x1' | '2x2' | '3x3'>('3x3');

  const [selectedFilter, setSelectedFilter] = useState(SelectedFilter.ALL);
  const [hasMore, setHasMore] = useState(true);
  const variables = {
    listed: null,
    marketplaceSubdomain: HOLAPLEX_MARKETPLACE_SUBDOMAIN,
    collectionMintAddress: props.collection?.mintAddress,
    limit: INITIAL_FETCH,
    offset: 0,
  };

  const { data, loading, fetchMore, refetch } = useNftsInCollectionQuery({
    variables,
  });

  // Note: unique check to backup indexer
  const nfts = data?.nfts || [];
  const nftsToShow =
    query === ''
      ? nfts
      : nfts.filter((nft) => nft.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="mt-10">
      <div
        className={`sticky top-0 z-10 flex flex-col items-center gap-6 bg-gray-900 bg-opacity-80 py-4 backdrop-blur-sm lg:flex-row lg:justify-between lg:gap-4`}
      >
        <div className={`flex w-full justify-start gap-4 lg:items-center`}>
          <TopLevelFilterButton
            title={`Show all`}
            onClick={() => {
              setSelectedFilter(SelectedFilter.ALL);
              refetch({
                ...variables,
                listed: null,
              });
            }}
            selected={selectedFilter === SelectedFilter.ALL}
          />
          <TopLevelFilterButton
            title={`Buy now`}
            onClick={() => {
              setSelectedFilter(SelectedFilter.LISTED);
              refetch({ ...variables, listed: true });
            }}
            selected={selectedFilter === SelectedFilter.LISTED}
          />
          <TopLevelFilterButton
            title={`Unlisted`}
            onClick={() => {
              setSelectedFilter(SelectedFilter.UNLISTED);
              refetch({ ...variables, listed: false });
            }}
            selected={selectedFilter === SelectedFilter.UNLISTED}
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
          <GridSelector gridView={gridView} setGridView={setGridView} />
        </div>
      </div>

      <div className="mt-20 w-full">
        <NFTGrid
          showCollection={false}
          ctaVariant={`collectionPage`}
          hasMore={hasMore && nfts.length > INITIAL_FETCH - 1}
          onLoadMore={async (inView) => {
            if (!inView || loading || nfts.length <= 0) {
              return;
            }

            const { data: newData } = await fetchMore({
              variables: {
                ...variables,
                limit: INFINITE_SCROLL_AMOUNT_INCREMENT,
                offset: nfts.length + INFINITE_SCROLL_AMOUNT_INCREMENT,
              },
              updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prev;
                const prevNfts = prev.nfts;
                const moreNfts = fetchMoreResult.nfts;
                if (!moreNfts.length) {
                  setHasMore(false);
                }

                fetchMoreResult.nfts = [...prevNfts, ...moreNfts];

                return { ...fetchMoreResult };
              },
            });
          }}
          nfts={uniq(nftsToShow)}
          gridView={gridView}
          refetch={refetch}
          loading={loading}
          marketplace={data?.marketplace as any}
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

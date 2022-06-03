import { CollectionRaisedCard } from '@/common/components/collections/CollectionRaisedCard';
import {
  CollectionPage,
  CollectionTabRoute,
} from '@/common/components/collections/collections.util';
import { FollowItem } from '@/common/components/elements/FollowModal';
import { HOLAPLEX_MARKETPLACE_SUBDOMAIN } from '@/common/constants/marketplace';
import CollectionLayout from '@/layouts/CollectionLayout';
import { GetServerSideProps } from 'next';
import {
  INFINITE_SCROLL_AMOUNT_INCREMENT,
  INITIAL_FETCH,
  NFTGrid,
} from 'pages/profiles/[publicKey]/nfts';
import React, { ReactElement, useState } from 'react';
import { graphqlRequestClient } from 'src/graphql/graphql-request';
import { GetCollectionQuery, useNftsInCollectionQuery } from 'src/graphql/indexerTypes';
import { getSdk } from 'src/graphql/indexerTypes.ssr';

export const getServerSideProps: GetServerSideProps<CollectionPage> = async (context) => {
  const collectionAddress = (context.query.collectionAddress || '') as string;

  const { getCollection } = getSdk(graphqlRequestClient);

  const collection = await getCollection({
    address: collectionAddress,
  });

  return {
    props: {
      collectionAddress,
      collection: collection.nft,
    },
  };
};

export default function CollectionNFTsPage(props: CollectionPage) {
  const [hasMore, setHasMore] = useState(true);
  const variables = {
    marketplaceSubdomain: HOLAPLEX_MARKETPLACE_SUBDOMAIN,
    collectionMintAddress: props.collection?.mintAddress,
    limit: INITIAL_FETCH,
    offset: 0,
  };

  const { data, loading, fetchMore, refetch } = useNftsInCollectionQuery({
    variables,
  });

  const nfts = data?.nfts || [];

  return (
    <div className="mt-10">
      <div>Search and filter</div>

      <div className="mt-20 flex ">
        <div className="mr-10 w-80">Sidebar Placeholder</div>
        <NFTGrid
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
          nfts={nfts}
          gridView={'3x3'}
          refetch={refetch}
          loading={loading}
          marketplace={data?.marketplace as any}
        />
      </div>
    </div>
  );
}

CollectionNFTsPage.getLayout = function getLayout(page: ReactElement) {
  return <CollectionLayout {...page.props}>{page}</CollectionLayout>;
};

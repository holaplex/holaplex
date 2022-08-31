import { ApolloQueryResult, OperationVariables } from '@apollo/client';
import { GetServerSideProps } from 'next';
import { isEmpty } from 'ramda';
import React, { FC, useState } from 'react';
import { InView } from 'react-intersection-observer';
import { TailSpin } from 'react-loader-spinner';
import CollectionProfileCard, {
  LoadingCollectionProfileCard,
} from '@/views/collections/CollectionProfileCard';
import NoProfileItems, { NoProfileVariant } from '@/components/NoProfileItems';
import { None } from '@/components/OfferForm';
import ProfileLayout from '@/views/profiles/ProfileLayout';
import { ProfileDataProvider } from '@/views/profiles/ProfileDataProvider';
import { CollectionNfTsQuery, useCollectionNfTsQuery } from '@/graphql/indexerTypes';
import {
  getProfileServerSideProps,
  WalletDependantPageProps,
} from '@/views/profiles/getProfileServerSideProps';

const COLLECTION_FETCH = 500;
const COLLECTION_INFINITE_SCROLL_AMOUNT_INCREMENT = 500;

type Collection = NonNullable<CollectionNfTsQuery['ownedCollection'][0]['collection']>;

interface CollectionGridProps {
  collections: Collection[];
  refetch: (
    variables?: Partial<OperationVariables> | undefined
  ) => Promise<ApolloQueryResult<None>>;
  onLoadMore: (inView: boolean, entry: IntersectionObserverEntry) => Promise<void>;
  hasMore: boolean;
  loading?: boolean;
  ctaVariant?: NoProfileVariant;
}

const CollectionGrid: FC<CollectionGridProps> = ({ collections, ...props }) => {
  return (
    <>
      <div className={`mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4`}>
        {props.loading ? (
          <>
            <LoadingCollectionProfileCard />
            <LoadingCollectionProfileCard />
            <LoadingCollectionProfileCard />
            <LoadingCollectionProfileCard />
          </>
        ) : (
          <>
            {collections.length === 0 ? (
              <div className={`col-span-full`}>
                <NoProfileItems variant={props.ctaVariant} />
              </div>
            ) : (
              collections.map((collection, i) =>
                !collection ? null : (
                  <CollectionProfileCard
                    key={`${collection.address}-${i}`}
                    address={collection?.address}
                    name={collection.name}
                    image={collection.image}
                  />
                )
              )
            )}
          </>
        )}
      </div>
      {props.hasMore && (
        <div>
          <InView threshold={0.1} onChange={props.onLoadMore}>
            <div className={`my-6 flex w-full items-center justify-center font-bold`}>
              <TailSpin height={50} width={50} color={`grey`} ariaLabel={`loading-collections`} />
            </div>
          </InView>
        </div>
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps<WalletDependantPageProps> = async (context) =>
  getProfileServerSideProps(context);

function CollectionsPage({ publicKey, ...props }: WalletDependantPageProps) {
  const [hasMore, setHasMore] = useState(true);

  const variables = {
    creator: publicKey,
    owner: publicKey,
    limit: COLLECTION_FETCH,
    offset: 0,
  };

  const { data, loading, refetch, fetchMore } = useCollectionNfTsQuery({
    variables: variables,
  });

  const unique = (
    collectionNFTs: CollectionNfTsQuery['ownedCollection'],
    createdCollectionNFTs: CollectionNfTsQuery['createdCollection']
  ): Collection[] => {
    let uniqueCollections: Collection[] = [];
    collectionNFTs?.forEach((collectionNft) => {
      if (
        collectionNft.collection &&
        !uniqueCollections.find((u) => u.address === collectionNft.collection?.address)
      ) {
        uniqueCollections.push(collectionNft.collection);
      }
    });
    createdCollectionNFTs?.forEach((collectionNft) => {
      if (
        collectionNft.collection &&
        !uniqueCollections.find((u) => u.address === collectionNft.collection?.address)
      ) {
        uniqueCollections.push(collectionNft.collection);
      }
    });
    return uniqueCollections;
  };
  const ownedCollections = data?.ownedCollection || [];
  const createdCollections = data?.createdCollection || [];

  const collections = unique(ownedCollections, createdCollections);

  const onLoadMore = async (inView: boolean) => {
    if (!inView || loading || (ownedCollections.length <= 0 && createdCollections.length <= 0)) {
      return;
    }

    const { data: newData } = await fetchMore({
      variables: {
        ...variables,
        limit: COLLECTION_INFINITE_SCROLL_AMOUNT_INCREMENT,
        offset: ownedCollections.length + COLLECTION_INFINITE_SCROLL_AMOUNT_INCREMENT,
      },

      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        const prevOwnedCollections = prev.ownedCollection;
        const moreOwnedCollections = fetchMoreResult.ownedCollection;
        const prevCreatedCollections = prev.createdCollection;
        const moreCreatedCollections = fetchMoreResult.createdCollection;
        if (isEmpty(moreOwnedCollections) && isEmpty(moreCreatedCollections)) {
          setHasMore(false);
        }

        fetchMoreResult.ownedCollection = [...prevOwnedCollections, ...moreOwnedCollections];
        fetchMoreResult.createdCollection = [...prevCreatedCollections, ...moreCreatedCollections];

        return { ...fetchMoreResult };
      },
    });
  };

  return (
    <div>
      <CollectionGrid
        hasMore={
          (ownedCollections.length > COLLECTION_FETCH - 1 ||
            createdCollections.length > COLLECTION_FETCH - 1) &&
          hasMore
        }
        onLoadMore={onLoadMore}
        loading={loading}
        refetch={refetch}
        collections={collections}
        ctaVariant={`collections`}
      />
    </div>
  );
}

export default CollectionsPage;

CollectionsPage.getLayout = function getLayout(
  profileData: WalletDependantPageProps & { children: JSX.Element }
): JSX.Element {
  return (
    <ProfileDataProvider profileData={profileData}>
      <ProfileLayout profileData={profileData}>{profileData.children}</ProfileLayout>
    </ProfileDataProvider>
  );
};

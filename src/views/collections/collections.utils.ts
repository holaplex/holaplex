import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { graphqlRequestClient } from 'src/graphql/graphql-request';
import { GetCollectionQuery } from 'src/graphql/indexerTypes';
import { getSdk } from 'src/graphql/indexerTypes.ssr';

// Moving some items here to improve dev experinece / reduce duplication
export enum CollectionTabRoute {
  NFTS = 'nfts',
  ACTIVITY = 'activity',
  ABOUT = 'about',
}

export type NFTCollection = GetCollectionQuery['nft'];

export interface CollectionPageProps {
  collectionAddress: string;
  collection: NFTCollection;
}

const { getCollection } = getSdk(graphqlRequestClient);
export async function getCollectionPageServerSideProps(context: GetServerSidePropsContext) {
  const collectionAddress = (context.query.collectionAddress || '') as string;

  const collection = await getCollection({
    address: collectionAddress,
  });

  return {
    props: {
      collectionAddress,
      collection: collection.nft || collection.nftByMintAddress,
    },
  };
}

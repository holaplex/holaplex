import { GetCollectionQuery } from 'src/graphql/indexerTypes';

// Moving some items here to improve dev experinece / reduce duplication
export enum CollectionTabRoute {
  NFTS = 'nfts',
  ACTIVITY = 'activity',
  ABOUT = 'about',
}

export type NFTCollection = GetCollectionQuery['nft'];

export interface CollectionPage {
  collectionAddress: string;
  collectionTab?: CollectionTabRoute;
  collection: NFTCollection;
}

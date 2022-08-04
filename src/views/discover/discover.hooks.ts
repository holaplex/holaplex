import { CollectionPreviewCardData } from '@/components/CollectionPreviewCard';
import { ProfilePreviewData } from '@/components/ProfilePreviewCard';
import {
  InfiniteScrollHook,
  InfiniteScrollQueryContext,
  UpdateResultsFunction,
  useHolaplexInfiniteScrollQuery,
} from '@/hooks/useApolloQuery';
import { DiscoverNFTCardData } from 'src/pages/discover/nfts';
import { useCallback } from 'react';
import {
  DiscoverCollectionsByMarketCapQuery,
  ProfilePreviewFragment,
  useDiscoverCollectionsByMarketCapLazyQuery,
  useDiscoverCollectionsByVolumeLazyQuery,
  useDiscoverNftsActiveOffersLazyQuery,
  useDiscoverNftsAllLazyQuery,
  useDiscoverNftsBuyNowLazyQuery,
  useDiscoverProfilesAllLazyQuery,
} from 'src/graphql/indexerTypes';
import {
  CollectionPreviewFragment,
  DiscoverCollectionsByVolumeQuery,
  DiscoverNftsBuyNowQuery,
  DiscoverProfilesAllQuery,
  MarketplaceAuctionHouseFragment,
  NftCardFragment,
} from 'src/graphql/indexerTypes.ssr';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

interface DiscoverNftsQueryParams {
  searchTerm?: string | null | undefined;
  limit: number;
  offset: number;
}

export interface DiscoverNftsQueryContext
  extends InfiniteScrollQueryContext<DiscoverNFTCardData, DiscoverNftsQueryParams, void> {}

export function useDiscoverNftsBuyNowLazyQueryWithTransforms(
  searchTerm: string | null,
  limit: number,
  fetchMoreLimit: number
): DiscoverNftsQueryContext {
  return useDiscoverNftsQuery(useDiscoverNftsBuyNowLazyQuery, searchTerm, limit, fetchMoreLimit);
}

export function useDiscoverNftsActiveOffersLazyQueryWithTransforms(
  searchTerm: string | null,
  limit: number,
  fetchMoreLimit: number
): DiscoverNftsQueryContext {
  return useDiscoverNftsQuery(
    useDiscoverNftsActiveOffersLazyQuery,
    searchTerm,
    limit,
    fetchMoreLimit
  );
}

export function useDiscoverNftsAllLazyQueryWithTransforms(
  searchTerm: string | null,
  limit: number,
  fetchMoreLimit: number
): DiscoverNftsQueryContext {
  return useDiscoverNftsQuery(useDiscoverNftsAllLazyQuery, searchTerm, limit, fetchMoreLimit);
}

function useDiscoverNftsQuery(
  hook: InfiniteScrollHook<DiscoverNftsBuyNowQuery, DiscoverNftsQueryParams>,
  searchTerm: string | null,
  limit: number,
  fetchMoreLimit: number
): DiscoverNftsQueryContext {
  const mergeResultsFunction: UpdateResultsFunction<DiscoverNftsBuyNowQuery> = useCallback(
    (previous, more) => {
      if (!more) return previous;
      more.nfts = [...previous.nfts, ...more.nfts];
      return { ...more };
    },
    []
  );

  return useHolaplexInfiniteScrollQuery<
    DiscoverNFTCardData,
    DiscoverNftsQueryParams,
    DiscoverNftsBuyNowQuery['nfts'][0],
    DiscoverNftsBuyNowQuery
  >(
    hook,
    { searchTerm, limit, offset: 0 },
    limit,
    fetchMoreLimit,
    (e, o) => transformNftCardData(e, o.marketplace),
    (r) => r.nfts,
    mergeResultsFunction
  );
}

function transformNftCardData(
  cardData: NftCardFragment,
  marketplace?: MarketplaceAuctionHouseFragment | null
): DiscoverNFTCardData {
  notNullish(marketplace?.auctionHouses[0], 'marketplace?.auctionHouses[0]');
  return { nft: cardData, marketplace: marketplace!.auctionHouses[0]! };
}

interface DiscoverCollectionsQueryParams {
  searchTerm?: string | null | undefined;
  start: Date;
  end: Date;
  limit: number;
  offset: number;
}

export interface DiscoverCollectionsQueryContext
  extends InfiniteScrollQueryContext<
    CollectionPreviewCardData,
    DiscoverCollectionsQueryParams,
    void
  > {}

export function useDiscoverCollectionsByMarketcapQueryWithTransforms(
  searchTerm: string | null,
  startDate: Date,
  endDate: Date,
  limit: number,
  fetchMoreLimit: number
): DiscoverCollectionsQueryContext {
  const mergeResultsFunction: UpdateResultsFunction<DiscoverCollectionsByMarketCapQuery> =
    useCallback((previous, more) => {
      if (!more) return previous;

      more.collectionsFeaturedByMarketCap = [
        ...previous.collectionsFeaturedByMarketCap,
        ...more.collectionsFeaturedByMarketCap,
      ];
      return { ...more };
    }, []);

  return useHolaplexInfiniteScrollQuery<
    CollectionPreviewCardData,
    DiscoverCollectionsQueryParams,
    DiscoverCollectionsByMarketCapQuery['collectionsFeaturedByMarketCap'][0],
    DiscoverCollectionsByMarketCapQuery
  >(
    useDiscoverCollectionsByMarketCapLazyQuery,
    { searchTerm, start: startDate, end: endDate, limit, offset: 0 },
    limit,
    fetchMoreLimit,
    (e, _) => transformCollectionCardData(e),
    (r) => r.collectionsFeaturedByMarketCap,
    mergeResultsFunction
  );
}

export function useDiscoverCollectionsByVolumeLazyQueryWithTransforms(
  searchTerm: string | null,
  startDate: Date,
  endDate: Date,
  limit: number,
  fetchMoreLimit: number
): DiscoverCollectionsQueryContext {
  const mergeResultsFunction: UpdateResultsFunction<DiscoverCollectionsByVolumeQuery> = useCallback(
    (previous, more) => {
      if (!more) return previous;

      more.collectionsFeaturedByVolume = [
        ...previous.collectionsFeaturedByVolume,
        ...more.collectionsFeaturedByVolume,
      ];

      return { ...more };
    },
    []
  );

  return useHolaplexInfiniteScrollQuery<
    CollectionPreviewCardData,
    DiscoverCollectionsQueryParams,
    DiscoverCollectionsByVolumeQuery['collectionsFeaturedByVolume'][0],
    DiscoverCollectionsByVolumeQuery
  >(
    useDiscoverCollectionsByVolumeLazyQuery,
    { searchTerm, start: startDate, end: endDate, limit, offset: 0 },
    limit,
    fetchMoreLimit,
    (e, _) => transformCollectionCardData(e),
    (r) => r.collectionsFeaturedByVolume,
    mergeResultsFunction
  );
}

export function useDiscoverCollectionsNewLazyQueryWithTransforms(
  searchTerm: string | null,
  startDate: Date,
  endDate: Date,
  limit: number,
  fetchMoreLimit: number
): DiscoverCollectionsQueryContext {
  //TODO update with new and notable query (when that's done)
  return useDiscoverCollectionsByVolumeLazyQueryWithTransforms(
    searchTerm,
    startDate,
    endDate,
    limit,
    fetchMoreLimit
  );
}

function useDiscoverCollectionsQuery(
  hook: InfiniteScrollHook<DiscoverCollectionsByMarketCapQuery, DiscoverCollectionsQueryParams>,
  searchTerm: string | null,
  startDate: Date,
  endDate: Date,
  limit: number,
  fetchMoreLimit: number
): DiscoverCollectionsQueryContext {
  const mergeResultsFunction: UpdateResultsFunction<DiscoverCollectionsByMarketCapQuery> =
    useCallback((previous, more) => {
      if (!more) return previous;
      more.collectionsFeaturedByMarketCap = [
        ...previous.collectionsFeaturedByMarketCap,
        ...more.collectionsFeaturedByMarketCap,
      ];
      return { ...more };
    }, []);

  return useHolaplexInfiniteScrollQuery<
    CollectionPreviewCardData,
    DiscoverCollectionsQueryParams,
    DiscoverCollectionsByMarketCapQuery['collectionsFeaturedByMarketCap'][0],
    DiscoverCollectionsByMarketCapQuery
  >(
    hook,
    { searchTerm, start: startDate, end: endDate, limit, offset: 0 },
    limit,
    fetchMoreLimit,
    (e, _) => transformCollectionCardData(e),
    (r) => r.collectionsFeaturedByMarketCap,
    mergeResultsFunction
  );
}

function transformCollectionCardData(
  cardData: CollectionPreviewFragment
): CollectionPreviewCardData {
  return {
    address: cardData.nft.mintAddress,
    name: cardData.nft.name,
    imageUrl: cardData.nft.image,
    floorPriceSol: (cardData.floorPrice ?? 0) / LAMPORTS_PER_SOL,
    nftCount: cardData.nftCount ?? 0,
  };
}

interface DiscoverProfilesQueryParams {
  userWallet?: string | undefined;
  limit: number;
  offset: number;
}

export interface DiscoverProfilesQueryContext
  extends InfiniteScrollQueryContext<ProfilePreviewData, DiscoverProfilesQueryParams, void> {}

export function useDiscoverProfilesAllLazyQueryWithTransforms(
  userWallet: string | undefined,
  limit: number,
  fetchMoreLimit: number
): DiscoverProfilesQueryContext {
  const mergeResultsFunction: UpdateResultsFunction<DiscoverProfilesAllQuery> = useCallback(
    (previous, more) => {
      if (!more) return previous;

      more.followWallets = [...previous.followWallets, ...more.followWallets];

      return { ...more };
    },
    []
  );

  return useHolaplexInfiniteScrollQuery<
    ProfilePreviewData,
    DiscoverProfilesQueryParams,
    ProfilePreviewFragment,
    DiscoverProfilesAllQuery
  >(
    useDiscoverProfilesAllLazyQuery,
    { userWallet, limit, offset: 0 },
    limit,
    fetchMoreLimit,
    transformProfilePreview,
    (r) => r.followWallets,
    mergeResultsFunction
  );
}

function transformProfilePreview(data: ProfilePreviewFragment): ProfilePreviewData {
  notNullish(data.nftCounts.created, 'data.nftCounts.created');
  notNullish(data.nftCounts.owned, 'data.nftCounts.owned');

  return {
    address: data.address,
    nftsOwned: data.nftCounts.owned,
    nftsCreated: data.nftCounts.created,
    handle: data.profile?.handle,
    profileImageUrl: data.profile?.profileImageUrlHighres,
    bannerImageUrl: data.profile?.bannerImageUrl,
  };
}

function notNullish(value: any, name: string): void {
  if (value === null || value === undefined) {
    throw new Error(`${name} must not be nullish.`);
  }
}

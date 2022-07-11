import { ProfilePreviewData } from '@/components/ProfilePreviewCard';
import {
  InfiniteScrollHook,
  InfiniteScrollQueryContext,
  UpdateResultsFunction,
  useHolaplexInfiniteScrollQuery,
} from '@/hooks/useApolloQuery';
import { DiscoverNFTCardData } from 'pages/discover/nfts';
import { useCallback } from 'react';
import {
  ProfilePreviewFragment,
  useDiscoverNftsActiveOffersLazyQuery,
  useDiscoverNftsAllLazyQuery,
  useDiscoverNftsBuyNowLazyQuery,
  useDiscoverProfilesAllLazyQuery,
} from 'src/graphql/indexerTypes';
import {
  DiscoverNftsBuyNowQuery,
  DiscoverProfilesAllQuery,
  MarketplaceAuctionHouseFragment,
  NftCardFragment,
} from 'src/graphql/indexerTypes.ssr';

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
  notNullish(marketplace?.auctionHouse, 'marketplace?.auctionHouse');
  return { nft: cardData, marketplace: marketplace!.auctionHouse! };
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

import { ProfilePreviewData } from '@/components/ProfilePreviewCard';
import { PublicKey } from '@solana/web3.js';
import { HomeData } from 'pages';
import { useMemo } from 'react';
import { useHomeQuery } from 'src/graphql/indexerTypes';
import {
  BuyNowListingFragment,
  HomeQuery,
  MarketplacePreviewFragment,
  ProfilePreviewFragment,
} from 'src/graphql/indexerTypes.ssr';
import { FeedItem } from '../alpha/feed.utils';
import { FeaturedBuyNowListingsData, ListingPreviewData } from './FeaturedBuyNowListingsSection';
import { FeaturedMarketplacesData, MarketplacePreviewData } from './FeaturedMarketplacesSection';
import { FeaturedProfilesData } from './FeaturedProfilesSection';
import { HeroSectionData } from './HeroSection';

export interface QueryContext<T> {
  data?: T | undefined;
  loading: boolean;
  error?: Error | undefined;
  refetch: () => void;
}

//TODO remove once other profiles have enough followers to preclude this one in the backend
const DISALLOWED_PROFILES: string[] = ['ho1aVYd4TDWCi1pMqFvboPPc3J13e4LgWkWzGJpPJty'];

export function useHomeQueryWithTransforms(
  userWallet: PublicKey | null,
  featuredProfileLimit: number,
  featuredBowNowLimit: number,
  feedEventsLimit: number
): QueryContext<HomeData> {
  const queryContext = useHomeQuery({
    variables: {
      userWallet: userWallet,
      featuredProfileLimit: featuredProfileLimit,
      featuredBuyNowLimit: featuredBowNowLimit,
      feedEventsLimit: feedEventsLimit,
    },
  });
  const data: HomeData | undefined = useMemo(() => {
    let result: HomeData | undefined;
    if (!queryContext.loading && queryContext.called && !queryContext.error) {
      result = {
        feedEvents: transformHeroSectionData(queryContext.data?.feedEvents),
        featuredProfiles: transformFeaturedProfiles(queryContext.data?.followWallets),
        featuredMarketplaces: transformFeaturedMarketplaces(
          queryContext.data?.featuredMarketplace0,
          queryContext.data?.featuredMarketplace1,
          queryContext.data?.featuredMarketplace2,
          queryContext.data?.featuredMarketplace3,
          queryContext.data?.featuredMarketplace4,
          queryContext.data?.featuredMarketplace5,
          queryContext.data?.featuredMarketplace6,
          queryContext.data?.featuredMarketplace7
        ),
        featuredBuyNowListings: transformFeaturedBuyNowListings(
          queryContext.data?.featuredListings,
          queryContext.data?.buyNowMarketplace
        ),
      };
    }
    return result;
  }, [queryContext]);

  return {
    data: data,
    loading: queryContext.loading,
    error: queryContext.error,
    refetch: queryContext.refetch,
  };
}

function transformHeroSectionData(data?: HomeQuery['feedEvents']): HeroSectionData {
  const result: HeroSectionData = [];
  if (data) {
    for (const event of data) {
      try {
        result.push(transformFeedEvent(event));
      } catch (e) {
        //TODO would be better to let this bubble up to the query and affect the query state
        // (e.g. by re-fetching with some excluded wallets) but while gracefully degrading to show happy profiles
        console.error(e);
      }
    }
  }
  return result;
}

function transformFeedEvent(data: HomeQuery['feedEvents'][0]): FeedItem {
  // TODO FeedItem should really be changed to a custom object
  return { ...data };
}

function transformFeaturedProfiles(data?: HomeQuery['followWallets']): FeaturedProfilesData {
  const result: FeaturedProfilesData = [];
  if (data) {
    for (const profile of data) {
      if (!DISALLOWED_PROFILES.includes(profile.address)) {
        try {
          result.push(transformProfilePreview(profile));
        } catch (e) {
          //TODO would be better to let this bubble up to the query and affect the query state
          // (e.g. by re-fetching with some excluded wallets) but while gracefully degrading to show happy profiles
          console.error(e);
        }
      }
    }
  }
  return result;
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

function transformFeaturedMarketplaces(
  ...data: (MarketplacePreviewFragment | null | undefined)[]
): FeaturedMarketplacesData {
  const result: FeaturedMarketplacesData = [];
  if (data) {
    for (const marketplace of data) {
      if (marketplace != null) {
        try {
          result.push(transformMarketplacePreview(marketplace));
        } catch (e) {
          //TODO would be better to let this bubble up to the query and affect the query state
          // (e.g. by re-fetching with some excluded wallets) but while gracefully degrading to show happy profiles
          console.error(e);
        }
      }
    }
  }
  return result;
}

function transformMarketplacePreview(data: MarketplacePreviewFragment): MarketplacePreviewData {
  notNullish(data.auctionHouse, 'data.auctionHouse');
  notNullish(data.bannerUrl, 'data.bannerUrl');
  notNullish(data.creators, 'data.creators');
  notNullish(data.name, 'data.name');
  notNullish(data.stats, 'data.stats');
  notNullish(data.stats?.nfts, 'data.stats.nfts');
  notNullish(data.subdomain, 'data.subdomain');

  return {
    subdomain: data.subdomain,
    name: data.name,
    bannerUrl: data.bannerUrl,
    creators: data.creators.map((c) => ({
      address: c.creatorAddress,
      profileImageUrl: c.profile?.profileImageUrlHighres,
      handle: c.profile?.handle,
    })),
    floorPriceLamports: parseFloatSilently(data.auctionHouse?.stats?.floor) ?? undefined,
    nftCount: parseIntSilently(data.auctionHouse?.stats?.floor) ?? undefined,
  };
}

function transformFeaturedBuyNowListings(
  listings?: HomeQuery['featuredListings'],
  marketplace?: HomeQuery['buyNowMarketplace']
): FeaturedBuyNowListingsData {
  const result: FeaturedBuyNowListingsData = [];
  if (listings) {
    for (const listing of listings) {
      try {
        result.push(transformBuyNowListing(listing, marketplace));
      } catch (e) {
        //TODO would be better to let this bubble up to the query and affect the query state
        // (e.g. by re-fetching with some excluded wallets) but while gracefully degrading to show happy profiles
        console.error(e);
      }
    }
  }
  return result;
}

function transformBuyNowListing(
  listing: BuyNowListingFragment,
  marketplace?: HomeQuery['buyNowMarketplace']
): ListingPreviewData {
  notNullish(listing.nft, 'listing.nft');
  notNullish(marketplace, 'marketplace');
  notNullish(marketplace?.auctionHouse, 'marketplace.auctionHouse');

  return {
    auctionHouse: marketplace!.auctionHouse!,
    nft: listing.nft!,
  };
}

function notNullish(value: any, name: string): void {
  if (value === null || value === undefined) {
    throw new Error(`${name} must not be nullish.`);
  }
}

function parseFloatSilently(toParse?: string | undefined | null): number | null {
  if (typeof toParse === 'string') {
    try {
      return Number.parseFloat(toParse);
    } catch (e) {
      // swallow
    }
  }
  return null;
}

function parseIntSilently(toParse?: string | undefined | null): number | null {
  if (typeof toParse === 'string') {
    try {
      return Number.parseInt(toParse);
    } catch (e) {
      // swallow
    }
  }
  return null;
}

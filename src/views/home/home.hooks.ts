import { CollectionPreviewCardData } from '@/components/CollectionPreviewCard';
import { ProfilePreviewData } from '@/components/ProfilePreviewCard';
import { QueryContext } from '@/hooks/useApolloQuery';
import { IndexerSDK, Listing } from '@/modules/indexer';
import { PublicKey } from '@solana/web3.js';
import { HomeData } from 'src/pages';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CollectionPreviewFragment,
  useHomeQuery,
  BuyNowListingFragment,
  HomeQuery,
  MarketplacePreviewFragment,
  ProfilePreviewFragment,
} from 'src/graphql/indexerTypes';
import { FeedItem } from '../alpha/feed.utils';
import { FeaturedBuyNowListingsData, ListingPreviewData } from './FeaturedBuyNowListingsSection';
import { FeaturedCollectionsByMarketCapData } from './FeaturedCollectionsByMarketCapSection';
import { FeaturedCollectionsByVolumeData } from './FeaturedCollectionsByVolumeSection';
import { FeaturedMarketplacesData, MarketplacePreviewData } from './FeaturedMarketplacesSection';
import { FeaturedProfilesData } from './FeaturedProfilesSection';
import { HeroSectionData } from './HeroSection';

//TODO remove once other profiles have enough followers to preclude this one in the backend
const DISALLOWED_PROFILES: string[] = ['ho1aVYd4TDWCi1pMqFvboPPc3J13e4LgWkWzGJpPJty'];

export function useHomeQueryWithTransforms(
  userWallet: PublicKey | null,
  limits: {
    featuredCollectionsLimit: number;
    featuredProfileLimit: number;
    featuredBowNowLimit: number;
    feedEventsLimit: number;
    featuredAuctionsLimit: number;
  }
): QueryContext<HomeData> {
  const queryContext = useHomeQuery({
    //TODO add time window to featuredCollectionsByVolume and featuredCollectionsByMarketCap queries
    variables: {
      userWallet: userWallet,
      featuredCollectionsLimit: limits.featuredCollectionsLimit,
      featuredProfileLimit: limits.featuredProfileLimit,
      featuredBuyNowLimit: limits.featuredBowNowLimit,
      feedEventsLimit: limits.feedEventsLimit,
    },
  });

  const featuredAuctionContext: QueryContext<Listing[]> = usePrepareFeaturedAuctions(
    limits.featuredAuctionsLimit
  );

  const loading: boolean = queryContext.loading || featuredAuctionContext.loading;

  const data: HomeData | undefined = useMemo(() => {
    let result: HomeData | undefined;
    if (!loading && queryContext.called && !queryContext.error) {
      result = {
        feedEvents: transformHeroSectionData(queryContext.data?.feedEvents),
        featuredCollectionsByVolume: transformFeaturedCollectionsByVolume(
          queryContext.data?.collectionsFeaturedByVolume
        ),
        featuredCollectionsByMarketCap: transformFeaturedCollectionsByMarketCap(
          queryContext.data?.collectionsFeaturedByMarketCap
        ),
        featuredProfiles: transformFeaturedProfiles(queryContext.data?.followWallets),
        featuredMarketplaces: transformFeaturedMarketplaces(
          queryContext.data?.featuredMarketplaces
        ),
        featuredBuyNowListings: transformFeaturedBuyNowListings(
          queryContext.data?.featuredListings,
          queryContext.data?.buyNowMarketplace
        ),
        featuredAuctions: featuredAuctionContext.data ?? [],
      };
    }
    return result;
  }, [queryContext, featuredAuctionContext, loading]);

  return {
    data: data,
    loading: loading,
    error: queryContext.error,
    refetch: queryContext.refetch,
    fetchMore: () => {},
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

function transformFeaturedCollectionsByVolume(
  data?: HomeQuery['collectionsFeaturedByVolume']
): FeaturedCollectionsByVolumeData {
  const result: FeaturedCollectionsByVolumeData = [];
  if (data) {
    for (const profile of data) {
      try {
        result.push(transformCollectionPreview(profile));
      } catch (e) {
        //TODO would be better to let this bubble up to the query and affect the query state
        // (e.g. by re-fetching with some excluded wallets) but while gracefully degrading to show happy profiles
        console.error(e);
      }
    }
  }
  return result;
}

function transformFeaturedCollectionsByMarketCap(
  data?: HomeQuery['collectionsFeaturedByMarketCap']
): FeaturedCollectionsByMarketCapData {
  const result: FeaturedCollectionsByVolumeData = [];
  if (data) {
    for (const profile of data) {
      try {
        result.push(transformCollectionPreview(profile));
      } catch (e) {
        //TODO would be better to let this bubble up to the query and affect the query state
        // (e.g. by re-fetching with some excluded wallets) but while gracefully degrading to show happy profiles
        console.error(e);
      }
    }
  }
  return result;
}

function transformCollectionPreview(data: CollectionPreviewFragment): CollectionPreviewCardData {
  return {
    address: data.nft.mintAddress,
    imageUrl: data.nft.image,
    name: data.nft.name,
    nftCount: data.nftCount ?? 0,
    floorPriceSol: data.floorPrice ?? 0,
  };
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
  data?: MarketplacePreviewFragment[] | null | undefined
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
  notNullish(data.auctionHouses[0], 'data.auctionHouses[0]');
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
    floorPriceLamports: parseFloatSilently(data.auctionHouses[0]?.stats?.floor) ?? undefined,
    nftCount: parseIntSilently(data.stats?.nfts) ?? undefined,
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
  notNullish(marketplace?.auctionHouses[0], 'marketplace.auctionHouses[0]');

  return {
    auctionHouse: marketplace!.auctionHouses[0]!,
    nft: listing.nft!,
  };
}

const WHICHDAO = process.env.NEXT_PUBLIC_WHICHDAO as string;
const DAO_LIST_IPFS =
  process.env.NEXT_PUBLIC_DAO_LIST_IPFS ||
  'https://ipfs.cache.holaplex.com/bafkreidnqervhpcnszmjrj7l44mxh3tgd7pphh5c4jknmnagifsm62uel4';

function usePrepareFeaturedAuctions(nListings: number): QueryContext<Listing[]> {
  const [result, setResult] = useState<Listing[] | undefined>();
  const [loading, setLoading] = useState<boolean>(true);

  async function DAOStoreFrontList() {
    if (WHICHDAO) {
      const response = await fetch(DAO_LIST_IPFS);
      const json = await response.json();
      return json[WHICHDAO];
    }
    return [];
  }

  const isAuction: (listing: Listing) => boolean = useCallback(
    (listing) =>
      listing.endsAt !== undefined && listing.endsAt !== null && listing.endsAt.trim() !== '',
    []
  );

  const compareListingsForSort: (a: Listing, b: Listing) => number = useCallback((a, b) => {
    const aBids: number = a.totalUncancelledBids ? a.totalUncancelledBids : 0;
    const bBids: number = b.totalUncancelledBids ? b.totalUncancelledBids : 0;
    if (aBids != bBids) {
      // primarily sort by most bids first
      return bBids - aBids;
    } else {
      // secondarily sort by ending soonest
      const aEnd: number = a.endsAt ? Date.parse(a.endsAt) : Number.MAX_SAFE_INTEGER;
      const bEnd: number = b.endsAt ? Date.parse(b.endsAt) : Number.MAX_SAFE_INTEGER;
      return aEnd - bEnd;
    }
  }, []);

  const applyListingFilterAndSort: (listings: Listing[]) => Listing[] = useCallback(
    (listings: Listing[]) => {
      const result: Listing[] = listings.filter(isAuction);
      result.sort(compareListingsForSort);
      return result;
    },
    [compareListingsForSort, isAuction]
  );

  useEffect(() => {
    async function run() {
      setLoading(true);
      const selectedDaoSubdomains = await DAOStoreFrontList();
      const allListings = await IndexerSDK.getListings();
      let daoFilteredListings = allListings;

      if (WHICHDAO) {
        daoFilteredListings = daoFilteredListings.filter((listing) =>
          selectedDaoSubdomains.includes(listing.subdomain)
        );
      }

      setResult(applyListingFilterAndSort(daoFilteredListings).slice(0, nListings));
      setLoading(false);
    }
    run();
  }, [nListings, applyListingFilterAndSort]);

  return {
    loading: loading,
    data: result,
    refetch: () => {},
    fetchMore: () => {},
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

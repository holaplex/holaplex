import { ProfilePreviewData } from '@/common/components/elements/ProfilePreviewCard';
import { FeaturedProfilesData } from '@/common/components/home/FeaturedProfilesSection';
import { PublicKey } from '@solana/web3.js';
import { HomeData } from 'pages';
import { useMemo } from 'react';
import { HomeQuery, ProfilePreviewFragment, useHomeQuery } from '../../../graphql/indexerTypes';

export interface QueryContext<T> {
  data?: T | undefined;
  loading: boolean;
  error?: Error | undefined;
}

//TODO remove once other profiles have enough followers to preclude this one in the backend
const DISALLOWED_PROFILES: string[] = ['ho1aVYd4TDWCi1pMqFvboPPc3J13e4LgWkWzGJpPJty'];

export function useHomeQueryWithTransforms(
  userWallet: PublicKey | null,
  featuredProfileLimit: number
): QueryContext<HomeData> {
  const queryContext = useHomeQuery({
    variables: { userWallet: userWallet, featuredProfileLimit: featuredProfileLimit },
  });
  const data: HomeData | undefined = useMemo(() => {
    let result: HomeData | undefined;
    if (!queryContext.loading && queryContext.called && !queryContext.error) {
      result = {
        featuredProfiles: transformFeaturedProfiles(queryContext.data?.followWallets),
      };
    }
    return result;
  }, [queryContext]);

  return { data: data, loading: queryContext.loading, error: queryContext.error };
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

function notNullish(value: any, name: string): void {
  if (value === null || value === undefined) {
    throw new Error(`${name} must not be nullish.`);
  }
}

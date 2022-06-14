import { useWallet, WalletContextState } from '@solana/wallet-adapter-react';
import { useEffect } from 'react';
import { FeaturedProfilesQuery, useFeaturedProfilesLazyQuery } from 'src/graphql/indexerTypes';
import { ProfilePreviewData } from '../components/elements/ProfilePreviewCard';

export interface QueryContext<T> {
  data?: T | undefined;
  loading: boolean;
  error?: Error | undefined;
}

//TODO remove once other profiles have enough followers to preclude this one in the backend
const DISALLOWED_PROFILES: string[] = ['ho1aVYd4TDWCi1pMqFvboPPc3J13e4LgWkWzGJpPJty'];

function useFeaturedProfilesData() {
  const wallet: WalletContextState = useWallet();
  const [featuredProfilesQuery, queryContext] = useFeaturedProfilesLazyQuery();
  
  useEffect(() => {
    async function query(): Promise<void> {
      await featuredProfilesQuery({ variables: { limit: 25, userWallet: wallet?.publicKey } });
    }
    
    // TODO implement better checking for whether we need to call 
    if (!queryContext.loading && !queryContext.called) {
      query();
    }
  }, [wallet, featuredProfilesQuery, queryContext.loading, queryContext.called]);

  return queryContext;
}

// fetching the list of profiles to feature (only need their address)
export function useFeaturedProfiles(): QueryContext<string[]> {
  const queryContext = useFeaturedProfilesData();

  //TODO implement caching of transformed object
  return {
    data:
      queryContext.data?.followWallets
        .filter((w) => !DISALLOWED_PROFILES.includes(w.address))
        .map((w) => w.address) ?? [],
    loading: queryContext.loading,
    error: queryContext.error,
  };
}

// fetching data for a single profile preview card
export function useProfilePreview(address: string): QueryContext<ProfilePreviewData> {
  const queryContext = useFeaturedProfilesData();
  
  console.log(address, queryContext);
  const gqlObject: FeaturedProfilesQuery['followWallets'][0] | null | undefined =
    queryContext.data?.followWallets.find((w) => w.address === address);

  let error: Error | undefined = queryContext.error;
  if (!error && gqlObject) {
    if (gqlObject.nftCounts.created === null || gqlObject.nftCounts.created === undefined) {
      error = new Error('Missing count of NFTs created.');
    } else if (gqlObject.nftCounts.owned === null || gqlObject.nftCounts.owned === undefined) {
      error = new Error('Missing count of NFTs collected.');
    }
  }

  if (error) return { loading: false, error: error };

  //TODO implement caching of transformed object
  let data: ProfilePreviewData | undefined;
  if (gqlObject) {
    data = {
      address: gqlObject.address,
      nftsOwned: gqlObject.nftCounts.owned,
      nftsCreated: gqlObject.nftCounts.created,
      handle: gqlObject.profile?.handle,
      profileImageUrl: gqlObject.profile?.profileImageUrlHighres,
      bannerImageUrl: gqlObject.profile?.bannerImageUrl,
    };
  }

  return {
    data: data,
    loading: queryContext.loading,
    error: error,
  };
}

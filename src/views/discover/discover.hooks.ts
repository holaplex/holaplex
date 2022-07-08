import { ProfilePreviewData } from '@/components/ProfilePreviewCard';
import {
  LazyQueryContext,
  useApolloLazyQueryWithTransform,
} from '@/hooks/useGraphQLQueryWithTransform';
import { useCallback, useReducer, useState } from 'react';
import { ProfilePreviewFragment, useDiscoverProfilesAllLazyQuery } from 'src/graphql/indexerTypes';
import { DiscoverProfilesAllQuery } from 'src/graphql/indexerTypes.ssr';

interface DiscoverProfilesQueryParams {
  userWallet: string | undefined;
  limit: number;
  offset: number;
}

export interface DiscoverProfilesQueryContext extends LazyQueryContext<ProfilePreviewData[], DiscoverProfilesQueryParams, void> {
  hasMore: boolean;
  fetchMore: () => void;
}

export function useDiscoverProfilesAllLazyQueryWithTransforms(
  userWallet: string | undefined,
  limit: number,
  fetchMoreLimit: number
): DiscoverProfilesQueryContext {
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [fetchMoreCallCount, incrementFetchMoreCallCount] = useReducer((c) => c + 1, 0);

  const context: LazyQueryContext<
    ProfilePreviewData[],
    DiscoverProfilesQueryParams,
    DiscoverProfilesAllQuery
  > = useApolloLazyQueryWithTransform(
    useDiscoverProfilesAllLazyQuery,
    { userWallet, limit, offset: 0 },
    (r) => r.followWallets.map(transformProfilePreview)
  );

  const fetchMore = useCallback(() => {
    context.fetchMore({
      variables: {
        userWallet: userWallet,
        limit: fetchMoreLimit,
        offset: limit + fetchMoreCallCount * fetchMoreLimit,
      },
      updateResults: (previous, more) => {
        if (!more) return previous;
        setHasMore(more.followWallets.length > 0);
        more.followWallets = [...previous.followWallets, ...more.followWallets];
        return { ...more };
      },
    });
    incrementFetchMoreCallCount();
  }, [context, fetchMoreCallCount, incrementFetchMoreCallCount, fetchMoreLimit, limit, userWallet]);

  return {
    ...context,
    fetchMore: fetchMore,
    hasMore: hasMore,
  };
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

import { CardGridWithHeader } from '@/components/CardGrid';
import ProfilePreviewCard, {
  ProfilePreviewProps,
  ProfilePreviewLoadingCard,
} from '@/components/ProfilePreviewCard';
import {
  DiscoverProfilesQueryContext,
  useDiscoverProfilesAllLazyQueryWithTransforms,
} from '@/views/discover/discover.hooks';
import { useConnectedWalletProfile } from '@/views/_global/ConnectedWalletProfileProvider';
import { useCallback, useEffect, useState } from 'react';
import { DiscoverPageProps, DiscoverLayout } from '@/views/discover/DiscoverLayout';
import { useUrlQueryParam } from '@/hooks/useUrlQueryParam';

const SEARCH_DEBOUNCE_TIMEOUT_MS: number = 500;
const INITIAL_FETCH: number = 36;
const INFINITE_SCROLL_AMOUNT_INCREMENT = 24;

enum TypeOption {
  ALL = 'all',
  CREATORS = 'creators',
  COLLECTORS = 'collectors',
}

const DEFAULT_TYPE: TypeOption = TypeOption.ALL;

export default function DiscoverProfilesTab(): JSX.Element {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { value: typeFilter } = useUrlQueryParam<TypeOption>('type', DEFAULT_TYPE, true);
  const [profileData, setProfileData] = useState<ProfilePreviewProps[]>([]);

  const userProfile = useConnectedWalletProfile();
  const queryContext = useQuery(typeFilter, userProfile.connectedProfile?.pubkey ?? undefined);

  // TODO send search to backend
  useEffect(() => {
    const searchTermLowerCase: string = searchTerm && searchTerm.toLocaleLowerCase();
    if (queryContext.data) {
      setProfileData(
        queryContext.data
          .filter((w) => w.handle?.toLocaleLowerCase().includes(searchTermLowerCase))
          .map((w) => ({
            address: w.address,
            context: { ...queryContext, data: w },
          }))
      );
    }
    // only refresh when data are updated, not other aspects of the query context
  }, [queryContext.data, searchTerm]);

  const onLoadMore = useCallback(
    async (inView: boolean) => {
      if (!inView || queryContext.loading || profileData.length <= 0) {
        return;
      }

      queryContext.fetchMore();
    },
    [queryContext, profileData]
  );

  return (
    <CardGridWithHeader<ProfilePreviewProps>
      cardContext={{
        noDataFallback: <div className="flex justify-center p-4">No matching profiles</div>,
        cardCreator: (data) => <ProfilePreviewCard {...data} />,
        loadingCardCreator: () => <ProfilePreviewLoadingCard />,
      }}
      dataContext={{
        data: profileData,
        refetch: queryContext.refetch,
        onLoadMore: onLoadMore,
        hasMore: queryContext.hasMore,
        loading: queryContext.loading,
      }}
      search={{
        onChange: (v) => setSearchTerm(v),
        debounceTimeout: SEARCH_DEBOUNCE_TIMEOUT_MS,
        placeholder: 'Search profiles',
      }}
    />
  );
}

DiscoverProfilesTab.getLayout = function getLayout(
  discoverPage: DiscoverPageProps & { children: JSX.Element }
): JSX.Element {
  return <DiscoverLayout content={discoverPage.children} />;
};

function useQuery(type: TypeOption, userWallet: string | undefined): DiscoverProfilesQueryContext {
  const allQueryContext: DiscoverProfilesQueryContext =
    useDiscoverProfilesAllLazyQueryWithTransforms(
      userWallet,
      INITIAL_FETCH,
      INFINITE_SCROLL_AMOUNT_INCREMENT
    );

  useEffect(() => {
    switch (type) {
      case TypeOption.ALL:
        allQueryContext.query();
        break;

      default:
        allQueryContext.query();
    }
  }, [type]);

  let context: DiscoverProfilesQueryContext;
  if (type === TypeOption.ALL) context = allQueryContext;
  else context = allQueryContext;

  return context;
}

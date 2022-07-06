import { CardGridWithHeader } from '@/components/CardGrid';
import { FilterOption } from '@/components/Filters';
import ProfilePreviewCard, { ProfilePreviewProps, ProfilePreviewLoadingCard } from '@/components/ProfilePreviewCard';
import { useUrlQueryParam } from '@/views/discover/discover.hooks';
import { useConnectedWalletProfile } from '@/views/_global/ConnectedWalletProfileProvider';
import { isEmpty } from 'ramda';
import { useCallback, useEffect, useState } from 'react';
import { useDiscoverProfilesAllLazyQuery } from 'src/graphql/indexerTypes';
import { DiscoverPageProps, DiscoverLayout } from '@/views/discover/DiscoverLayout';

const SEARCH_DEBOUNCE_TIMEOUT_MS: number = 500;

enum TypeOption {
  ALL = 'all',
  CREATORS = 'creators',
  COLLECTORS = 'collectors',
}

const DEFAULT_TYPE: TypeOption = TypeOption.ALL;

const options: FilterOption<TypeOption>[] = [
  {
    label: 'All',
    value: TypeOption.ALL,
  },
];

export default function DiscoverProfilesTab(): JSX.Element {
  const INITIAL_FETCH: number = 24;
  const INFINITE_SCROLL_AMOUNT_INCREMENT = 24;

  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const {value: typeFilter} = useUrlQueryParam<TypeOption>('type', DEFAULT_TYPE, true);
  const [profileData, setProfileData] = useState<ProfilePreviewProps[]>([]);

  const userProfile = useConnectedWalletProfile();
  const queryContext = useQuery(
    userProfile.connectedProfile?.pubkey ?? undefined,
    typeFilter,
    INITIAL_FETCH,
    0
  );

  // when the server returns a profile with insufficient data to display the
  //  preview, remove it from the carousel
  const onInsufficientDataForAProfile = useCallback<(profileAddress: string) => void>(
    (profileAddress) => {
      setProfileData(profileData.filter((p) => p.address !== profileAddress));
    },
    [profileData]
  );

  useEffect(() => {
    const searchTermLowerCase: string = searchTerm.toLocaleLowerCase();
    if (queryContext.data) {
      setProfileData(
        queryContext.data.followWallets
          .filter(
            (w) =>
              searchTermLowerCase === '' ||
              w.profile?.handle.toLocaleLowerCase().includes(searchTermLowerCase)
          )
          .map((w) => ({
            address: w.address,
            onInsufficientData: onInsufficientDataForAProfile,
            data: {
              address: w.address ?? '',
              profile: w.profile ?? {},
              nftCounts: w.nftCounts,
            },
          }))
      );
    }
  }, [queryContext.data, searchTerm]);

  const onLoadMore = useCallback(
    async (inView: boolean) => {
      if (!inView || queryContext.loading || profileData.length <= 0) {
        return;
      }

      await queryContext.fetchMore({
        variables: {
          limit: INFINITE_SCROLL_AMOUNT_INCREMENT,
          offset: profileData.length + INFINITE_SCROLL_AMOUNT_INCREMENT,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          const prevProfiles = prev.followWallets;
          const moreProfiles = fetchMoreResult.followWallets;
          if (isEmpty(moreProfiles)) {
            setHasMore(false);
          }

          fetchMoreResult.followWallets = [...prevProfiles, ...moreProfiles];

          return { ...fetchMoreResult };
        },
      });
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
        hasMore: hasMore,
        loading: queryContext.loading,
      }}
      search={{ onChange: (v) => setSearchTerm(v), debounceTimeout: SEARCH_DEBOUNCE_TIMEOUT_MS }}
    />
  );
}

DiscoverProfilesTab.getLayout = function getLayout(
  discoverPage: DiscoverPageProps & { children: JSX.Element }
): JSX.Element {
  return (
    <DiscoverLayout
      filters={[
        {
          title: 'Type',
          options: options,
          default: TypeOption.ALL,
          queryId: 'type',
          onChange: () => {},
        },
      ]}
      content={discoverPage.children}
    />
  );
};

const useQuery = (
  userWallet: string | undefined,
  type: TypeOption,
  limit: number,
  offset: number
) => {
  const [allQuery, allQueryContext] = useDiscoverProfilesAllLazyQuery();

  useEffect(() => {
    switch (type) {
      case TypeOption.ALL: {
        allQuery({ variables: { userWallet: userWallet, limit: limit, offset: offset } });
        break;
      }
      default: //do-nothing
    }
  }, [type, limit, offset, userWallet, allQuery]);

  switch (type) {
    case TypeOption.ALL:
      return allQueryContext;
    default:
      return allQueryContext;
  }
};

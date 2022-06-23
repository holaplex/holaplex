import { CardGridWithHeader } from '@/common/components/elements/CardGrid';
import ProfilePreviewCard, {
  ProfilePreviewLoadingCard,
  ProfilePreviewProps,
} from '@/common/components/elements/ProfilePreviewCard';
import { FilterOption } from '@/common/components/layouts/Filters';
import { useConnectedWalletProfile } from '@/common/context/ConnectedWalletProfileProvider';
import { routerQueryParamToEnumValue } from '@/common/utils/router';
import { DiscoverLayout, DiscoverPageProps } from '@/layouts/DiscoverLayout';
import { useRouter } from 'next/router';
import { isEmpty } from 'ramda';
import { useCallback, useEffect, useState } from 'react';
import { useDiscoverProfilesAllLazyQuery } from 'src/graphql/indexerTypes';

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

export default function DiscoverCollectionsTab(): JSX.Element {
  const INITIAL_FETCH: number = 24;
  const INFINITE_SCROLL_AMOUNT_INCREMENT = 24;

  const router = useRouter();
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<TypeOption>(DEFAULT_TYPE);
  const [profileData, setProfileData] = useState<ProfilePreviewProps[]>([]);

  // set default filters if the URL doesnt already contain them, and get the filter otherwise
  useEffect(() => {
    let result: TypeOption = DEFAULT_TYPE;
    if (router) {
      const queryValue: TypeOption | undefined = routerQueryParamToEnumValue(
        router,
        'type',
        (v) => v as TypeOption
      );
      if (queryValue === undefined) {
        router.replace({ query: { type: result } });
      }
      if (queryValue) setTypeFilter(queryValue);
    }
  }, [router]);

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
      search={{ onChange: (v) => setSearchTerm(v) }}
    />
  );
}

DiscoverCollectionsTab.getLayout = function getLayout(
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

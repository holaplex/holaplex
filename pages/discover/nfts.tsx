import { FilterOption } from '@/common/components/layouts/Filters';
import { DiscoverLayout, DiscoverPageProps } from '@/layouts/DiscoverLayout';
import { useRouter } from 'next/router';
import { LoadingNFTCard, NFTCard } from 'pages/profiles/[publicKey]/nfts';
import { isEmpty } from 'ramda';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { OwnedNfTsQuery, useDiscoverNftsBuyNowLazyQuery } from 'src/graphql/indexerTypes';
import { routerQueryParamToEnumValue } from '@/common/utils/router';
import { CardGridWithHeader } from '@/common/components/elements/CardGrid';
import DropdownSelect from '@/common/components/elements/DropdownSelect';
import { Option, Options } from '@/common/components/discover/discover.interfaces';

enum TypeFilterOption {
  ALL = 'all',
  BUY_NOW = 'buy-now',
  ACTIVE_OFFERS = 'active-offers',
  LIVE_AUCTIONS = 'auctions',
}

const DEFAULT_TYPE: TypeFilterOption = TypeFilterOption.BUY_NOW;

const TYPE_OPTIONS: FilterOption<TypeFilterOption>[] = [
  {
    label: 'Recently Listed',
    value: TypeFilterOption.BUY_NOW,
  }
];

enum SortOptionName {
  RECENTLY_LISTED,
  HIGHEST_SALES
}


const PRIMARY_SORT_OPTIONS: Option<SortOptionName>[] = [
  {
    label: 'Recently listed',
    value: SortOptionName.RECENTLY_LISTED,
    queryValue: 'recent'
  },
  {
    label: 'Highest sales',
    value: SortOptionName.HIGHEST_SALES,
    queryValue: 'sales'
  },
];

interface NFTCardCreatorData {
  nft: OwnedNfTsQuery['nfts'][0];
  marketplace: OwnedNfTsQuery['marketplace'];
}

export default function DiscoverNFTsTab(): JSX.Element {
  const INITIAL_FETCH: number = 24;
  const INFINITE_SCROLL_AMOUNT_INCREMENT = 24;

  const router = useRouter();
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<TypeFilterOption>(TypeFilterOption.BUY_NOW);
  const primarySortOptions: Options<SortOptionName> = useMemo(() => Options<SortOptionName>.of(PRIMARY_SORT_OPTIONS, 0), [PRIMARY_SORT_OPTIONS]);

  // set default filters if the URL doesnt already contain them, and get the filter otherwise
  useEffect(() => {
    let result: TypeFilterOption = DEFAULT_TYPE;
    if (router) {
      const queryValue: TypeFilterOption | undefined = routerQueryParamToEnumValue(router, 'type', v => v as TypeFilterOption);
      if (queryValue === undefined) {
        router.replace({ query: { type: result } });
      }
      if (queryValue) setTypeFilter(queryValue);
    }
  }, [router]);

  const nftQuery = useQuery(typeFilter, INITIAL_FETCH, 0);

  const nfts: NFTCardCreatorData[] = useMemo(() => {
    const marketplace = nftQuery.data?.marketplace;
    const result: NFTCardCreatorData[] = [];
    const searchLowerCase: string = searchTerm.toLocaleLowerCase();
    if (nftQuery.data) {
      result.push(
        ...nftQuery.data.nfts
          .filter(
            (n) => searchLowerCase === '' || n.name.toLocaleLowerCase().includes(searchLowerCase)
          )
          .map((n) => ({
            nft: n as NFTCardCreatorData['nft'],
            marketplace: marketplace as NFTCardCreatorData['marketplace'],
          }))
      );
    }
    return result;
  }, [nftQuery.data, searchTerm]);

  const onLoadMore = useCallback(
    async (inView: boolean) => {
      if (!inView || nftQuery.loading || nfts.length <= 0) {
        return;
      }

      await nftQuery.fetchMore({
        variables: {
          limit: INFINITE_SCROLL_AMOUNT_INCREMENT,
          offset: nfts.length + INFINITE_SCROLL_AMOUNT_INCREMENT,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          const prevNfts = prev.nfts;
          const moreNfts = fetchMoreResult.nfts;
          if (isEmpty(moreNfts)) {
            setHasMore(false);
          }

          fetchMoreResult.nfts = [...prevNfts, ...moreNfts];

          return { ...fetchMoreResult };
        },
      });
    },
    [nftQuery, nfts]
  );

  return (
    <CardGridWithHeader<NFTCardCreatorData>
      cardContext={{
        noDataFallback: <div>No matching NFTs</div>,
        cardCreator: (data, refetch, loading) => (
          <NFTCard
            nft={data.nft}
            refetch={refetch}
            loading={loading}
            //@ts-ignore this will not be undefined when the NFT data are present
            marketplace={data.marketplace}
          />
        ),
        loadingCardCreator: () => <LoadingNFTCard />,
      }}
      dataContext={{
        data: nfts,
        refetch: nftQuery.refetch,
        onLoadMore: onLoadMore,
        hasMore: hasMore,
        loading: nftQuery.loading,
      }}
      search={{ onChange: (v) => setSearchTerm(v) }}
      //TODO add submenus and hook them up to setting the router and queries
      menus={
        <CardGridWithHeader.HeaderElement>
          <DropdownSelect onSelect={i => primarySortOptions.setSelected(i)} default={primarySortOptions.getDefaultIndex() ?? undefined}>
            {primarySortOptions.getLabels()}
          </DropdownSelect>
        </CardGridWithHeader.HeaderElement>
      }
    />
  );
}

DiscoverNFTsTab.getLayout = function getLayout(
  discoverPage: DiscoverPageProps & { children: JSX.Element }
): JSX.Element {
  return (
    <DiscoverLayout
      filters={[
        {
          title: 'Type',
          options: TYPE_OPTIONS,
          default: DEFAULT_TYPE,
          queryId: 'type',
          onChange: () => {},
        },
      ]}
      content={discoverPage.children}
    />
  );
};

const useQuery = (type: TypeFilterOption, limit: number, offset: number) => {
  const [buyNowQuery, buyNowQueryContext] = useDiscoverNftsBuyNowLazyQuery();

  useEffect(() => {
    switch (type) {
      case TypeFilterOption.BUY_NOW: {
        buyNowQuery({ variables: { limit: limit, offset: offset } });
        break;
      }
      default: //do-nothing
    }
  }, [type, limit, offset, buyNowQuery]);

  switch (type) {
    case TypeFilterOption.BUY_NOW:
      return buyNowQueryContext;
    default:
      return buyNowQueryContext;
  }
};

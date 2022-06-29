import { FilterOption } from '@/common/components/layouts/Filters';
import { DiscoverLayout, DiscoverPageProps } from '@/layouts/DiscoverLayout';
import { useRouter } from 'next/router';
import { LoadingNFTCard, NFTCard } from 'pages/profiles/[publicKey]/nfts';
import { isEmpty, props } from 'ramda';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { OwnedNfTsQuery, useDiscoverNftsBuyNowLazyQuery } from 'src/graphql/indexerTypes';
import { routerQueryParamToEnumValue } from '@/common/utils/router';
import { CardGridWithHeader } from '@/common/components/elements/CardGrid';
import DropdownSelect from '@/common/components/elements/DropdownSelect';
import {
  SelectOption,
  SelectOptions,
  SelectOptionsSpec,
} from '@/common/components/discover/discover.models';
import { useSelectOptions } from '@/common/components/discover/discover.hooks';

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
  },
];

enum SortOptionName {
  PRICE,
  RECENTLY_LISTED,
  HIGHEST_SALES,
}

enum PriceSortOptionName {
  PRICE_DESC,
  PRICE_ASC,
}

enum SalesSortOptionName {
  PAST_DAY,
  PAST_WEEK,
  ALL_TIME,
}

const SORT_OPTIONS: SelectOptionsSpec[] = [
  {
    label: 'Price',
    value: SortOptionName.PRICE,
    queryValue: 'price',
    defaultSubOptionValue: PriceSortOptionName.PRICE_DESC,
    subOptions: [
      {
        label: 'High to Low',
        value: PriceSortOptionName.PRICE_DESC,
        queryValue: 'desc',
      },
      {
        label: 'Low to High',
        value: PriceSortOptionName.PRICE_ASC,
        queryValue: 'asc',
      },
    ],
  },
  {
    label: 'Recently listed',
    value: SortOptionName.RECENTLY_LISTED,
    queryValue: 'recent',
  },
  {
    label: 'Highest sales',
    value: SortOptionName.HIGHEST_SALES,
    queryValue: 'sales',
    defaultSubOptionValue: SalesSortOptionName.PAST_DAY,
    subOptions: [
      {
        label: 'Last 24 hours',
        value: SalesSortOptionName.PAST_DAY,
        queryValue: '24h',
      },
      {
        label: 'Last 7 days',
        value: SalesSortOptionName.PAST_WEEK,
        queryValue: '7d',
      },
      {
        label: 'All time',
        value: SalesSortOptionName.ALL_TIME,
        queryValue: 'all',
      },
    ],
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
  const sortOptions = useSelectOptions(SORT_OPTIONS, SortOptionName.PRICE);

  // set default filters if the URL doesnt already contain them, and get the filter otherwise
  useEffect(() => {
    let result: TypeFilterOption = DEFAULT_TYPE;
    if (router) {
      const queryValue: TypeFilterOption | undefined = routerQueryParamToEnumValue(
        router,
        'type',
        (v) => v as TypeFilterOption
      );
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

  const menus: JSX.Element[] = [
    <CardGridWithHeader.HeaderElement key="primary-sort">
      <DropdownSelect
        onSelect={(i) => sortOptions.setNthSelectedByIndex(i, 0)}
        defaultIndex={sortOptions.getNthDefaultValue(0)}
        selectedIndex={sortOptions.getNthSelectedIndex(0)}
      >
        {sortOptions.getNthLabels(0)}
      </DropdownSelect>
    </CardGridWithHeader.HeaderElement>,
  ];
  if (sortOptions.nthLevelHasOptions(1)) {
    menus.push(
      <CardGridWithHeader.HeaderElement key="secondary-sort">
        <DropdownSelect
          onSelect={(i) => sortOptions.setNthSelectedByIndex(i, 1)}
          defaultIndex={sortOptions.getNthDefaultValue(1)}
          // setting the selected index here because react reuses the
          //  dropdown component across selection options and ends up 
          //  storing the index from the most recently
          //  selected sub-option, which causes the selected option to be
          //  the wrong one after change the parent option.
          selectedIndex={sortOptions.getNthSelectedIndex(1)}
        >
          {sortOptions.getNthLabels(1)}
        </DropdownSelect>
      </CardGridWithHeader.HeaderElement>
    );
  }

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
      menus={menus}
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

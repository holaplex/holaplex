import { CardGridWithHeader } from '@/components/CardGrid';
import DropdownSelect from '@/components/DropdownSelect';
import { LoadingNFTCard, NFTCard, OwnedNFT } from 'pages/profiles/[publicKey]/nfts';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AuctionHouse, OwnedNfTsQuery, useDiscoverNftsBuyNowLazyQuery } from 'src/graphql/indexerTypes';
import { DiscoverLayout, DiscoverPageProps } from '@/views/discover/DiscoverLayout';
import { NestedSelectOption } from '@/views/discover/discover.models';
import { FilterOption } from '@/components/Filters';
import { useUrlQueryParam, UseUrlQueryParamData } from '@/hooks/useUrlQueryParam';

const SEARCH_DEBOUNCE_TIMEOUT_MS: number = 500;

// values are what appears in the URL
enum UrlParamKey {
  SEARCH = 'search',
  TYPE = 'type',
  BY = 'by',
  PRICE_DIRECTION = 'price-dir',
  SALE_WINDOW = 'sale-window',
}

// values are what appears in the URL
enum TypeFilterOption {
  ALL = 'all',
  BUY_NOW = 'buy-now',
  ACTIVE_OFFERS = 'active-offers',
  LIVE_AUCTIONS = 'auctions',
}

const DEFAULT_TYPE: TypeFilterOption = TypeFilterOption.BUY_NOW;

const TYPE_OPTIONS: FilterOption<TypeFilterOption>[] = [
  {
    label: 'All',
    value: TypeFilterOption.ALL,
  },
  {
    label: 'Buy now',
    value: TypeFilterOption.BUY_NOW,
  },
  {
    label: 'Active Offers',
    value: TypeFilterOption.ACTIVE_OFFERS,
  },
];

// values are what appears in the URL
enum SortOption {
  PRICE = 'price',
  RECENTLY_LISTED = 'recent',
  HIGHEST_SALES = 'sales',
}

// values are what appears in the URL
enum PriceSortOption {
  PRICE_DESC = 'desc',
  PRICE_ASC = 'asc',
}

// values are what appears in the URL
enum SalesSortOption {
  PAST_DAY = '24h',
  PAST_WEEK = '7d',
  ALL_TIME = 'all',
}

const URL_PARAM_DEFAULTS = {
  [UrlParamKey.SEARCH]: null as string | null,
  [UrlParamKey.TYPE]: TypeFilterOption.BUY_NOW,
  [UrlParamKey.BY]: SortOption.PRICE,
  [UrlParamKey.PRICE_DIRECTION]: PriceSortOption.PRICE_DESC,
  [UrlParamKey.SALE_WINDOW]: SalesSortOption.PAST_DAY,
};

const SORT_OPTIONS: NestedSelectOption = {
  defaultSubOptionValue: URL_PARAM_DEFAULTS[UrlParamKey.BY],
  subOptions: {
    [SortOption.PRICE]: {
      label: 'Price',
      value: SortOption.PRICE,
      defaultSubOptionValue: URL_PARAM_DEFAULTS[UrlParamKey.PRICE_DIRECTION],
      subOptions: {
        [PriceSortOption.PRICE_DESC]: {
          label: 'High to Low',
          value: PriceSortOption.PRICE_DESC,
        },
        [PriceSortOption.PRICE_ASC]: {
          label: 'Low to High',
          value: PriceSortOption.PRICE_ASC,
        },
      },
    },
    [SortOption.RECENTLY_LISTED]: {
      label: 'Recently listed',
      value: SortOption.RECENTLY_LISTED,
    },
    [SortOption.HIGHEST_SALES]: {
      label: 'Highest sales',
      value: SortOption.HIGHEST_SALES,
      defaultSubOptionValue: URL_PARAM_DEFAULTS[UrlParamKey.SALE_WINDOW],
      subOptions: {
        [SalesSortOption.PAST_DAY]: {
          label: 'Last 24 hours',
          value: SalesSortOption.PAST_DAY,
        },
        [SalesSortOption.PAST_WEEK]: {
          label: 'Last 7 days',
          value: SalesSortOption.PAST_WEEK,
        },
        [SalesSortOption.ALL_TIME]: {
          label: 'All time',
          value: SalesSortOption.ALL_TIME,
        },
      },
    },
  },
};

const SORT_OPTION_ORDER = {
  [UrlParamKey.BY]: Object.values(SORT_OPTIONS.subOptions!).map((o) => o.value),
  [UrlParamKey.SALE_WINDOW]: Object.values(
    SORT_OPTIONS.subOptions![SortOption.HIGHEST_SALES].subOptions!
  ).map((o) => o.value),
  [UrlParamKey.PRICE_DIRECTION]: Object.values(
    SORT_OPTIONS.subOptions![SortOption.PRICE].subOptions!
  ).map((o) => o.value),
};

export interface DiscoverNFTCardData {
  nft: OwnedNFT;
  marketplace: AuctionHouse;
}

export default function DiscoverNFTsTab(): JSX.Element {
  const INITIAL_FETCH: number = 24;
  const INFINITE_SCROLL_AMOUNT_INCREMENT = 24;

  const [hasMore, setHasMore] = useState(true);
  const [urlParams, urlParamSetters] = useUrlParams();
  const nftQuery = useQuery(
    urlParams[UrlParamKey.TYPE],
    urlParams[UrlParamKey.SEARCH],
    INITIAL_FETCH,
    0
  );

  const nfts: DiscoverNFTCardData[] = useMemo(() => {
    const marketplace = nftQuery.data?.marketplace;
    const result: DiscoverNFTCardData[] = [];
    if (nftQuery.data) {
      result.push(
        ...nftQuery.data.nfts.map((n) => ({
          nft: n as DiscoverNFTCardData['nft'],
          marketplace: marketplace as DiscoverNFTCardData['marketplace'],
        }))
      );
    }
    return result;
  }, [nftQuery.data]);

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
          if (moreNfts.length === 0) {
            setHasMore(false);
          }

          fetchMoreResult.nfts = [...prevNfts, ...moreNfts];

          return { ...fetchMoreResult };
        },
      });
    },
    [nftQuery, nfts]
  );

  const primarySortLabels: string[] = useMemo(
    () => SORT_OPTION_ORDER[UrlParamKey.BY].map((o) => SORT_OPTIONS.subOptions![o].label),
    []
  );

  const secondarySortLabels: string[] = useMemo(() => {
    let result: string[];
    if (urlParams[UrlParamKey.BY] === SortOption.PRICE) {
      result = SORT_OPTION_ORDER[UrlParamKey.PRICE_DIRECTION].map(
        (o) => SORT_OPTIONS.subOptions![SortOption.PRICE].subOptions![o].label
      );
    } else if (urlParams[UrlParamKey.BY] === SortOption.HIGHEST_SALES) {
      result = SORT_OPTION_ORDER[UrlParamKey.SALE_WINDOW].map(
        (o) => SORT_OPTIONS.subOptions![SortOption.HIGHEST_SALES].subOptions![o].label
      );
    } else {
      result = [];
    }
    return result;
  }, [urlParams]);

  const menus: JSX.Element[] = [
    <CardGridWithHeader.HeaderElement key="primary-sort">
      <DropdownSelect
        keys={SORT_OPTION_ORDER[UrlParamKey.BY]}
        onSelect={(k) => urlParamSetters[UrlParamKey.BY](k)}
        defaultKey={SORT_OPTIONS.defaultSubOptionValue}
      >
        {primarySortLabels}
      </DropdownSelect>
    </CardGridWithHeader.HeaderElement>,
  ];

  if (urlParams[UrlParamKey.BY] === SortOption.HIGHEST_SALES) {
    menus.push(
      <CardGridWithHeader.HeaderElement key="sales-sort">
        <DropdownSelect
          keys={SORT_OPTION_ORDER[UrlParamKey.SALE_WINDOW]}
          onSelect={(k) => urlParamSetters[UrlParamKey.SALE_WINDOW](k)}
          defaultKey={SORT_OPTIONS.subOptions![SortOption.HIGHEST_SALES].defaultSubOptionValue}
          selectedKey={urlParams[UrlParamKey.SALE_WINDOW]}
        >
          {secondarySortLabels}
        </DropdownSelect>
      </CardGridWithHeader.HeaderElement>
    );
  } else if (urlParams[UrlParamKey.BY] === SortOption.PRICE) {
    menus.push(
      <CardGridWithHeader.HeaderElement key="price-sort">
        <DropdownSelect
          keys={SORT_OPTION_ORDER[UrlParamKey.PRICE_DIRECTION]}
          onSelect={(k) => urlParamSetters[UrlParamKey.PRICE_DIRECTION](k)}
          defaultKey={SORT_OPTIONS.subOptions![SortOption.PRICE].defaultSubOptionValue}
          selectedKey={urlParams[UrlParamKey.PRICE_DIRECTION]}
        >
          {secondarySortLabels}
        </DropdownSelect>
      </CardGridWithHeader.HeaderElement>
    );
  }

  return (
    <CardGridWithHeader<DiscoverNFTCardData>
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
      search={{
        onChange: (v) => urlParamSetters[UrlParamKey.SEARCH](v.trim()),
        debounceTimeout: SEARCH_DEBOUNCE_TIMEOUT_MS,
      }}
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
          onChange: () => {},
        },
      ]}
      content={discoverPage.children}
    />
  );
};

function useQuery(
  type: TypeFilterOption,
  searchTerm: string | null,
  limit: number,
  offset: number
) {
  // TODO add other queries
  // TODO convert to new hook format
  const [buyNowQuery, buyNowQueryContext] = useDiscoverNftsBuyNowLazyQuery();

  useEffect(() => {
    switch (type) {
      case TypeFilterOption.BUY_NOW: {
        buyNowQuery({ variables: { limit: limit, offset: offset, searchTerm: searchTerm } });
        break;
      }
      default: //do-nothing
    }
  }, [type, limit, offset, buyNowQuery, searchTerm]);

  switch (type) {
    case TypeFilterOption.BUY_NOW:
      return buyNowQueryContext;
    default:
      return buyNowQueryContext;
  }
}

interface UseUrlParamsValues {
  [UrlParamKey.SEARCH]: string | null;
  [UrlParamKey.TYPE]: TypeFilterOption;
  [UrlParamKey.BY]: SortOption;
  [UrlParamKey.PRICE_DIRECTION]: PriceSortOption | null;
  [UrlParamKey.SALE_WINDOW]: SalesSortOption | null;
}

interface UseUrlParamsSetters {
  [UrlParamKey.SEARCH]: (value: string | null) => void;
  [UrlParamKey.TYPE]: (value: TypeFilterOption) => void;
  [UrlParamKey.BY]: (value: SortOption) => void;
  [UrlParamKey.PRICE_DIRECTION]: (value: PriceSortOption) => void;
  [UrlParamKey.SALE_WINDOW]: (value: SalesSortOption) => void;
}

function useUrlParams(): [UseUrlParamsValues, UseUrlParamsSetters] {
  const search: UseUrlQueryParamData<string | null> = useUrlQueryParam(
    UrlParamKey.SEARCH,
    URL_PARAM_DEFAULTS[UrlParamKey.SEARCH]
  );

  const typeFilter: UseUrlQueryParamData<TypeFilterOption> = useUrlQueryParam(
    UrlParamKey.TYPE,
    URL_PARAM_DEFAULTS[UrlParamKey.TYPE]
  );

  const primarySort: UseUrlQueryParamData<SortOption> = useUrlQueryParam(
    UrlParamKey.BY,
    URL_PARAM_DEFAULTS[UrlParamKey.BY]
  );

  const priceSort: UseUrlQueryParamData<PriceSortOption> = useUrlQueryParam(
    UrlParamKey.PRICE_DIRECTION,
    URL_PARAM_DEFAULTS[UrlParamKey.PRICE_DIRECTION],
    URL_PARAM_DEFAULTS[UrlParamKey.BY] === SortOption.PRICE
  );

  const salesSort: UseUrlQueryParamData<SalesSortOption> = useUrlQueryParam(
    UrlParamKey.SALE_WINDOW,
    URL_PARAM_DEFAULTS[UrlParamKey.SALE_WINDOW],
    URL_PARAM_DEFAULTS[UrlParamKey.BY] === SortOption.HIGHEST_SALES
  );

  const values: UseUrlParamsValues = useMemo(
    () => ({
      [UrlParamKey.SEARCH]: search.value,
      [UrlParamKey.TYPE]: typeFilter.value,
      [UrlParamKey.BY]: primarySort.value,
      [UrlParamKey.PRICE_DIRECTION]: priceSort.value,
      [UrlParamKey.SALE_WINDOW]: salesSort.value,
    }),
    [search.value, typeFilter.value, primarySort.value, priceSort.value, salesSort.value]
  );

  const primarySortSetter: UseUrlParamsSetters[UrlParamKey.BY] = useCallback(
    (value: SortOption) => {
      primarySort.set(value);

      // set the sub-option value in the URL back to its last selected value
      switch (value) {
        case SortOption.HIGHEST_SALES:
          salesSort.setActive(true);
          priceSort.setActive(false);
          break;

        case SortOption.PRICE:
          priceSort.setActive(true);
          salesSort.setActive(false);
          break;

        case SortOption.RECENTLY_LISTED:
          priceSort.setActive(false);
          salesSort.setActive(false);
          break;
      }
    },
    [primarySort.set, priceSort.setActive, salesSort.setActive]
  );

  const priceSortSetter: UseUrlParamsSetters[UrlParamKey.PRICE_DIRECTION] = useCallback(
    (value: PriceSortOption) => {
      priceSort.setAndActivate(value);
      salesSort.setActive(false);
    },
    [priceSort.setAndActivate, salesSort.setActive]
  );

  const salesSortSetter: UseUrlParamsSetters[UrlParamKey.SALE_WINDOW] = useCallback(
    (value: SalesSortOption) => {
      salesSort.setAndActivate(value);
      priceSort.setActive(false);
    },
    [salesSort.setAndActivate, priceSort.setActive]
  );

  const setters: UseUrlParamsSetters = useMemo(
    () => ({
      [UrlParamKey.SEARCH]: v => {search.set(v == null ? null : v.trim() || null)},
      [UrlParamKey.TYPE]: typeFilter.set,
      [UrlParamKey.BY]: primarySortSetter,
      [UrlParamKey.PRICE_DIRECTION]: priceSortSetter,
      [UrlParamKey.SALE_WINDOW]: salesSortSetter,
    }),
    [search.set, typeFilter.set, primarySortSetter, priceSortSetter, salesSortSetter]
  );

  return [values, setters];
}
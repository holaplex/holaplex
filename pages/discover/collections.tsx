import { UseUrlQueryParamData, useUrlQueryParam } from '@/views/discover/discover.hooks';
import { CardGridWithHeader } from '@/components/CardGrid';
import DropdownSelect from '@/components/DropdownSelect';
import { LoadingNFTCard, NFTCard } from 'pages/profiles/[publicKey]/nfts';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { OwnedNfTsQuery, useDiscoverNftsBuyNowLazyQuery } from 'src/graphql/indexerTypes';
import { DiscoverLayout, DiscoverPageProps } from '@/views/discover/DiscoverLayout';
import { NestedSelectOption, SelectOption } from '@/views/discover/discover.models';

const SEARCH_DEBOUNCE_TIMEOUT_MS: number = 500;

// values are what appears in the URL
enum UrlParamKey {
  SEARCH = 'search',
  BY = 'by',
  TIME_PERIOD = 'window',
}

// values are what appears in the URL
enum SortOption {
  BY_VOLUME = 'volume',
  BY_MARKET_CAP = 'marketcap',
  NEW = 'new',
}

// values are what appears in the URL
enum TimeWindowSortOption {
  PAST_DAY = '24h',
  PAST_WEEK = '7d',
  ALL_TIME = 'all',
}

const URL_PARAM_DEFAULTS = {
  [UrlParamKey.SEARCH]: null as string | null,
  [UrlParamKey.BY]: SortOption.BY_VOLUME,
  [UrlParamKey.TIME_PERIOD]: TimeWindowSortOption.PAST_DAY,
};

const TIME_WINDOW_SUBOPTIONS: { [key: string]: SelectOption } = {
  [TimeWindowSortOption.PAST_DAY]: {
    label: 'Last 24 hours',
    value: TimeWindowSortOption.PAST_DAY,
  },
  [TimeWindowSortOption.PAST_WEEK]: {
    label: 'Last 7 days',
    value: TimeWindowSortOption.PAST_WEEK,
  },
  [TimeWindowSortOption.ALL_TIME]: {
    label: 'All time',
    value: TimeWindowSortOption.ALL_TIME,
  },
};

const SORT_OPTIONS: NestedSelectOption = {
  defaultSubOptionValue: URL_PARAM_DEFAULTS[UrlParamKey.BY],
  subOptions: {
    [SortOption.BY_VOLUME]: {
      label: 'Top volume',
      value: SortOption.BY_VOLUME,
      defaultSubOptionValue: URL_PARAM_DEFAULTS[UrlParamKey.TIME_PERIOD],
      subOptions: TIME_WINDOW_SUBOPTIONS,
    },
    [SortOption.BY_MARKET_CAP]: {
      label: 'Top market cap',
      value: SortOption.BY_MARKET_CAP,
      defaultSubOptionValue: URL_PARAM_DEFAULTS[UrlParamKey.TIME_PERIOD],
      subOptions: TIME_WINDOW_SUBOPTIONS,
    },
    [SortOption.NEW]: {
      label: 'New & notable',
      value: SortOption.NEW,
    },
  },
};

const SORT_OPTION_ORDER = {
  [UrlParamKey.BY]: Object.values(SORT_OPTIONS.subOptions!).map((o) => o.value),
  [UrlParamKey.TIME_PERIOD]: Object.values(TIME_WINDOW_SUBOPTIONS).map((o) => o.value),
};

interface NFTCardCreatorData {
  nft: OwnedNfTsQuery['nfts'][0];
  marketplace: OwnedNfTsQuery['marketplace'];
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

  const nfts: NFTCardCreatorData[] = useMemo(() => {
    const marketplace = nftQuery.data?.marketplace;
    const result: NFTCardCreatorData[] = [];
    if (nftQuery.data) {
      result.push(
        ...nftQuery.data.nfts.map((n) => ({
          nft: n as NFTCardCreatorData['nft'],
          marketplace: marketplace as NFTCardCreatorData['marketplace'],
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
      result = SORT_OPTION_ORDER[UrlParamKey.TIME_PERIOD].map(
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
          keys={SORT_OPTION_ORDER[UrlParamKey.TIME_PERIOD]}
          onSelect={(k) => urlParamSetters[UrlParamKey.TIME_PERIOD](k)}
          defaultKey={SORT_OPTIONS.subOptions![SortOption.HIGHEST_SALES].defaultSubOptionValue}
          selectedKey={urlParams[UrlParamKey.TIME_PERIOD]}
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
  return <DiscoverLayout content={discoverPage.children} />;
};

function useQuery(
  type: SortOption,
  searchTerm: string | null,
  limit: number,
  offset: number
) {
  // TODO add other queries
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
  [UrlParamKey.TIME_PERIOD]: TimeWindowSortOption | null;
}

interface UseUrlParamsSetters {
  [UrlParamKey.SEARCH]: (value: string | null) => void;
  [UrlParamKey.TYPE]: (value: TypeFilterOption) => void;
  [UrlParamKey.BY]: (value: SortOption) => void;
  [UrlParamKey.PRICE_DIRECTION]: (value: PriceSortOption) => void;
  [UrlParamKey.TIME_PERIOD]: (value: TimeWindowSortOption) => void;
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

  const salesSort: UseUrlQueryParamData<TimeWindowSortOption> = useUrlQueryParam(
    UrlParamKey.TIME_PERIOD,
    URL_PARAM_DEFAULTS[UrlParamKey.TIME_PERIOD],
    URL_PARAM_DEFAULTS[UrlParamKey.BY] === SortOption.HIGHEST_SALES
  );

  const values: UseUrlParamsValues = useMemo(
    () => ({
      [UrlParamKey.SEARCH]: search.value,
      [UrlParamKey.TYPE]: typeFilter.value,
      [UrlParamKey.BY]: primarySort.value,
      [UrlParamKey.PRICE_DIRECTION]: priceSort.value,
      [UrlParamKey.TIME_PERIOD]: salesSort.value,
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

  const salesSortSetter: UseUrlParamsSetters[UrlParamKey.TIME_PERIOD] = useCallback(
    (value: TimeWindowSortOption) => {
      salesSort.setAndActivate(value);
      priceSort.setActive(false);
    },
    [salesSort.setAndActivate, priceSort.setActive]
  );

  const setters: UseUrlParamsSetters = useMemo(
    () => ({
      [UrlParamKey.SEARCH]: (v) => {
        search.set(v == null ? null : v.trim() || null);
      },
      [UrlParamKey.TYPE]: typeFilter.set,
      [UrlParamKey.BY]: primarySortSetter,
      [UrlParamKey.PRICE_DIRECTION]: priceSortSetter,
      [UrlParamKey.TIME_PERIOD]: salesSortSetter,
    }),
    [search.set, typeFilter.set, primarySortSetter, priceSortSetter, salesSortSetter]
  );

  return [values, setters];
}

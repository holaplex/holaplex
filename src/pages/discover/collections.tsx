import { CardGridWithHeader } from '@/components/CardGrid';
import DropdownSelect from '@/components/DropdownSelect';
import { useCallback, useEffect, useMemo } from 'react';
import { DiscoverLayout, DiscoverPageProps } from '@/views/discover/DiscoverLayout';
import { NestedSelectOption, SelectOption } from '@/views/discover/discover.models';
import { useUrlQueryParam, UseUrlQueryParamData } from '@/hooks/useUrlQueryParam';
import {
  DiscoverCollectionsQueryContext,
  useDiscoverCollectionsByMarketcapQueryWithTransforms,
  useDiscoverCollectionsByVolumeLazyQueryWithTransforms,
  useDiscoverCollectionsNewLazyQueryWithTransforms,
} from '@/views/discover/discover.hooks';
import { CollectionPreviewCard, CollectionPreviewCardData, CollectionPreviewLoadingCard } from '@/components/CollectionPreviewCard';

const SEARCH_DEBOUNCE_TIMEOUT_MS: number = 500;
const INITIAL_FETCH: number = 24;
const INFINITE_SCROLL_AMOUNT_INCREMENT = 24;

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
    //TODO re-add when indexer change is ready
    // [SortOption.NEW]: {
    //   label: 'New & notable',
    //   value: SortOption.NEW,
    // },
  },
};

const SORT_OPTION_ORDER = {
  [UrlParamKey.BY]: Object.values(SORT_OPTIONS.subOptions!).map((o) => o.value),
  [UrlParamKey.TIME_PERIOD]: Object.values(TIME_WINDOW_SUBOPTIONS).map((o) => o.value),
};


export default function DiscoverCollectionsTab(): JSX.Element {
  const [urlParams, urlParamSetters] = useUrlParams();
  const queryContext = useQuery(urlParams[UrlParamKey.BY], urlParams[UrlParamKey.TIME_PERIOD], urlParams[UrlParamKey.SEARCH]);

  const onLoadMore = useCallback(
    async (inView: boolean) => {
      if (
        inView &&
        !queryContext.loading &&
        (queryContext.data && queryContext.data.length > 0)
      ) {
        queryContext.fetchMore();
      }
      
    },
    [queryContext]
  );

  const primarySortLabels: string[] = useMemo(
    () => SORT_OPTION_ORDER[UrlParamKey.BY].map((o) => SORT_OPTIONS.subOptions![o].label),
    []
  );

  const secondarySortLabels: string[] = useMemo(() => {
    let result: string[];
    if (urlParams[UrlParamKey.BY] === SortOption.BY_VOLUME) {
      result = SORT_OPTION_ORDER[UrlParamKey.TIME_PERIOD].map(
        (o) => SORT_OPTIONS.subOptions![SortOption.BY_VOLUME].subOptions![o].label
      );
    } else if (urlParams[UrlParamKey.BY] === SortOption.BY_MARKET_CAP) {
      result = SORT_OPTION_ORDER[UrlParamKey.TIME_PERIOD].map(
        (o) => SORT_OPTIONS.subOptions![SortOption.BY_MARKET_CAP].subOptions![o].label
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
        selectedKey={urlParams[UrlParamKey.BY]}
      >
        {primarySortLabels}
      </DropdownSelect>
    </CardGridWithHeader.HeaderElement>,
  ];

  if (urlParams[UrlParamKey.BY] === SortOption.BY_VOLUME) {
    menus.push(
      <CardGridWithHeader.HeaderElement key="volume-sort">
        <DropdownSelect
          keys={SORT_OPTION_ORDER[UrlParamKey.TIME_PERIOD]}
          onSelect={(k) => urlParamSetters[UrlParamKey.TIME_PERIOD](k)}
          defaultKey={SORT_OPTIONS.subOptions![SortOption.BY_VOLUME].defaultSubOptionValue}
          selectedKey={urlParams[UrlParamKey.TIME_PERIOD]}
        >
          {secondarySortLabels}
        </DropdownSelect>
      </CardGridWithHeader.HeaderElement>
    );
  } else if (urlParams[UrlParamKey.BY] === SortOption.BY_MARKET_CAP) {
    menus.push(
      <CardGridWithHeader.HeaderElement key="volume-sort">
        <DropdownSelect
          keys={SORT_OPTION_ORDER[UrlParamKey.TIME_PERIOD]}
          onSelect={(k) => urlParamSetters[UrlParamKey.TIME_PERIOD](k)}
          defaultKey={SORT_OPTIONS.subOptions![SortOption.BY_MARKET_CAP].defaultSubOptionValue}
          selectedKey={urlParams[UrlParamKey.TIME_PERIOD]}
        >
          {secondarySortLabels}
        </DropdownSelect>
      </CardGridWithHeader.HeaderElement>
    );
  }

  return (
    <CardGridWithHeader<CollectionPreviewCardData>
      cardContext={{
        noDataFallback: <div>No matching Collections</div>,
        cardCreator: (data, refetch, loading) => (
          <CollectionPreviewCard context={{data: data, refetch: refetch, loading: loading, fetchMore: () => {}}} />
        ),
        loadingCardCreator: () => <CollectionPreviewLoadingCard />,
      }}
      dataContext={{
        data: queryContext.data,
        refetch: queryContext.refetch,
        onLoadMore: onLoadMore,
        hasMore: queryContext.hasMore,
        loading: queryContext.loading,
      }}
      search={{
        onChange: (v) => urlParamSetters[UrlParamKey.SEARCH](v.trim()),
        debounceTimeout: SEARCH_DEBOUNCE_TIMEOUT_MS,
        placeholder: "Search collections"
      }}
      menus={menus}
    />
  );
}

DiscoverCollectionsTab.getLayout = function getLayout(
  discoverPage: DiscoverPageProps & { children: JSX.Element }
): JSX.Element {
  return <DiscoverLayout content={discoverPage.children} />;
};

function useQuery(
  type: SortOption,
  timePeriod: TimeWindowSortOption | null,
  searchTerm: string | null
): DiscoverCollectionsQueryContext {
  if (type !== SortOption.BY_MARKET_CAP && type !== SortOption.BY_VOLUME && timePeriod != null) {
    throw new Error(`Cannot use time period with SortOption=${type}`);
  }

  const startDate: Date = useMemo(() => {
    let startDate: Date;
    if (timePeriod === TimeWindowSortOption.ALL_TIME) {
      startDate = new Date('2020-01-01');
    } else if (timePeriod === TimeWindowSortOption.PAST_DAY) {
      startDate = new Date(new Date().setDate(new Date().getDate() - 1));
    } else if (timePeriod === TimeWindowSortOption.PAST_WEEK) {
      startDate = new Date(new Date().setDate(new Date().getDate() - 7));
    } else {
      throw new Error(`Unsupported time period ${timePeriod}`);
    }
    return startDate;
  }, [timePeriod]);

  const marketcapQueryContext: DiscoverCollectionsQueryContext =
    useDiscoverCollectionsByMarketcapQueryWithTransforms(
      searchTerm,
      startDate,
      new Date(),
      INITIAL_FETCH,
      INFINITE_SCROLL_AMOUNT_INCREMENT
    );

  const volumeQueryContext: DiscoverCollectionsQueryContext =
    useDiscoverCollectionsByVolumeLazyQueryWithTransforms(
      searchTerm,
      startDate,
      new Date(),
      INITIAL_FETCH,
      INFINITE_SCROLL_AMOUNT_INCREMENT
    );

  const newQueryContext: DiscoverCollectionsQueryContext =
    useDiscoverCollectionsNewLazyQueryWithTransforms(
      searchTerm,
      startDate,
      new Date(),
      INITIAL_FETCH,
      INFINITE_SCROLL_AMOUNT_INCREMENT
    );

  useEffect(() => {
    if (type === SortOption.BY_VOLUME) volumeQueryContext.query();
    else if (type === SortOption.BY_MARKET_CAP) marketcapQueryContext.query();
    else if (type === SortOption.NEW) newQueryContext.query();
    // searchTerm, timePeriod are needed because of updating the query params...
  }, [type, searchTerm, timePeriod]);

  let context: DiscoverCollectionsQueryContext;
  if (type === SortOption.BY_VOLUME) context = volumeQueryContext;
  else if (type === SortOption.BY_MARKET_CAP) context = marketcapQueryContext;
  else if (type === SortOption.NEW) context = newQueryContext;
  else throw new Error(`Unsupported sort option ${type}`);

  return context;
}

interface UseUrlParamsValues {
  [UrlParamKey.SEARCH]: string | null;
  [UrlParamKey.BY]: SortOption;
  [UrlParamKey.TIME_PERIOD]: TimeWindowSortOption | null;
}

interface UseUrlParamsSetters {
  [UrlParamKey.SEARCH]: (value: string | null) => void;
  [UrlParamKey.BY]: (value: SortOption) => void;
  [UrlParamKey.TIME_PERIOD]: (value: TimeWindowSortOption) => void;
}

function useUrlParams(): [UseUrlParamsValues, UseUrlParamsSetters] {
  const search: UseUrlQueryParamData<string | null> = useUrlQueryParam(
    UrlParamKey.SEARCH,
    URL_PARAM_DEFAULTS[UrlParamKey.SEARCH]
  );

  const primarySort: UseUrlQueryParamData<SortOption> = useUrlQueryParam(
    UrlParamKey.BY,
    URL_PARAM_DEFAULTS[UrlParamKey.BY]
  );

  const timePeriodSort: UseUrlQueryParamData<TimeWindowSortOption> = useUrlQueryParam(
    UrlParamKey.TIME_PERIOD,
    URL_PARAM_DEFAULTS[UrlParamKey.TIME_PERIOD],
    URL_PARAM_DEFAULTS[UrlParamKey.BY] === SortOption.BY_VOLUME
  );

  const values: UseUrlParamsValues = useMemo(
    () => ({
      [UrlParamKey.SEARCH]: search.value,
      [UrlParamKey.BY]: primarySort.value,
      [UrlParamKey.TIME_PERIOD]: timePeriodSort.value,
    }),
    [search.value, primarySort.value, timePeriodSort.value]
  );

  const setters: UseUrlParamsSetters = useMemo(
    () => ({
      [UrlParamKey.SEARCH]: (v) => {
        search.set(v == null ? null : v.trim() || null);
      },
      [UrlParamKey.BY]: primarySort.set,
      [UrlParamKey.TIME_PERIOD]: timePeriodSort.set,
    }),
    [search.set, primarySort.set, timePeriodSort]
  );

  return [values, setters];
}

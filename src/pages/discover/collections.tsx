import { CardGridWithHeader } from '@/components/CardGrid';
import { useCallback, useEffect, useMemo } from 'react';
import { DiscoverLayout, DiscoverPageProps } from '@/views/discover/DiscoverLayout';
import { useUrlQueryParam, UseUrlQueryParamData } from '@/hooks/useUrlQueryParam';
import {
  DiscoverCollectionsQueryContext,
  useDiscoverCollectionsByMarketcapQueryWithTransforms,
  useDiscoverCollectionsByVolumeLazyQueryWithTransforms,
  useDiscoverCollectionsNewLazyQueryWithTransforms,
} from '@/views/discover/discover.hooks';
import {
  CollectionPreviewCard,
  CollectionPreviewCardData,
  CollectionPreviewLoadingCard,
} from '@/components/CollectionPreviewCard';
import { Select, SelectOption } from '@/components/Select';

const SEARCH_DEBOUNCE_TIMEOUT_MS: number = 500;
const INITIAL_FETCH: number = 24;
const INFINITE_SCROLL_AMOUNT_INCREMENT = 12;

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
}

const URL_PARAM_DEFAULTS = {
  [UrlParamKey.SEARCH]: null as string | null,
  [UrlParamKey.BY]: SortOption.BY_VOLUME,
  [UrlParamKey.TIME_PERIOD]: TimeWindowSortOption.PAST_DAY,
};

const TIME_WINDOW_SUBOPTIONS: SelectOption<TimeWindowSortOption>[] = [
  {
    label: 'Last 24 hours',
    value: TimeWindowSortOption.PAST_DAY,
  },
  {
    label: 'Last 7 days',
    value: TimeWindowSortOption.PAST_WEEK,
  },
];

const SORT_OPTIONS: SelectOption<SortOption>[] = [
  {
    label: 'Top volume',
    value: SortOption.BY_VOLUME,
  },
  {
    label: 'Top market cap',
    value: SortOption.BY_MARKET_CAP,
  },
];

interface FindItem<V> {
  value: V;
}

function findValueIn<F, V>(locate: F | null): (list: FindItem<F>[]) => V {
  return function (list: FindItem<F>[]) {
    return list.find((item) => item.value === locate) as unknown as V;
  };
}

export default function DiscoverCollectionsTab(): JSX.Element {
  const [urlParams, urlParamSetters] = useUrlParams();
  const queryContext = useQuery(
    urlParams[UrlParamKey.BY],
    urlParams[UrlParamKey.TIME_PERIOD],
    urlParams[UrlParamKey.SEARCH]
  );

  const onLoadMore = useCallback(
    async (inView: boolean) => {
      if (inView && !queryContext.loading && queryContext.data && queryContext.data.length > 0) {
        queryContext.fetchMore();
      }
    },
    [queryContext]
  );

  return (
    <CardGridWithHeader<CollectionPreviewCardData>
      cardContext={{
        noDataFallback: <div>No matching Collections</div>,
        cardCreator: (data, refetch, loading) => (
          <CollectionPreviewCard
            context={{ data: data, refetch: refetch, loading: loading, fetchMore: () => {} }}
          />
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
        placeholder: 'Search collections',
      }}
      menus={[
        <CardGridWithHeader.HeaderElement key="by" className="w-[175px]">
          <Select<SortOption>
            value={findValueIn<SortOption, SelectOption<SortOption>>(urlParams.by)(SORT_OPTIONS)}
            options={SORT_OPTIONS}
            onChange={(selected) => urlParamSetters[UrlParamKey.BY](selected.value)}
          />
        </CardGridWithHeader.HeaderElement>,
        <CardGridWithHeader.HeaderElement key="window" className="w-[175px]">
          <Select<TimeWindowSortOption>
            value={findValueIn<TimeWindowSortOption, SelectOption<TimeWindowSortOption>>(
              urlParams.window
            )(TIME_WINDOW_SUBOPTIONS)}
            options={TIME_WINDOW_SUBOPTIONS}
            onChange={(selected) => urlParamSetters[UrlParamKey.TIME_PERIOD](selected.value)}
          />
        </CardGridWithHeader.HeaderElement>,
      ]}
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
    if (timePeriod === TimeWindowSortOption.PAST_DAY) {
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

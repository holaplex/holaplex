import {
  LazyQueryHookOptions,
  LazyQueryResultTuple,
  QueryHookOptions,
  QueryResult,
} from '@apollo/client';
import { useCallback, useMemo, useReducer, useState, Dispatch, SetStateAction } from 'react';

export interface QueryContext<TData, TArgs = void, TGraphQLData = void> {
  data: TData | undefined;
  loading: boolean;
  error?: Error | undefined;
  refetch: () => void;
  fetchMore: (args: FetchMoreArgs<TArgs, TGraphQLData>) => void;
}

export interface UpdateResultsFunction<TGraphQLData> {
  (prev: TGraphQLData, more: TGraphQLData | null | undefined): TGraphQLData;
}

interface FetchMoreArgs<TArgs, TGraphQLData = void> {
  variables: TArgs;
  updateResults: UpdateResultsFunction<TGraphQLData>;
}

interface InfiniteScrollMinArgs {
  limit: number;
  offset: number;
}

export interface InfiniteScrollQueryContext<
  TDatum,
  TArgs extends InfiniteScrollMinArgs,
  TGraphQLDataObject = void
> extends LazyQueryContext<TDatum[], TArgs, TGraphQLDataObject> {
  fetchMore: () => void;
  hasMore: boolean;
}

export interface InfiniteScrollHook<TGraphQLDataObject, TArgs> {
  (baseOptions: LazyQueryHookOptions<TGraphQLDataObject, TArgs>): LazyQueryResultTuple<
    TGraphQLDataObject,
    TArgs
  >;
}

export function useHolaplexInfiniteScrollQuery<
  TDatum,
  TArgs extends InfiniteScrollMinArgs,
  TGraphQLElement = void,
  TGraphQLDataObject = void
>(
  hook: InfiniteScrollHook<TGraphQLDataObject, TArgs>,
  variables: TArgs,
  initialLimit: number,
  fetchMoreLimit: number,
  transformer: (element: TGraphQLElement, fullObject: TGraphQLDataObject) => TDatum,
  listExtractor: (raw: TGraphQLDataObject) => TGraphQLElement[] | undefined,
  mergeResultsFunction: FetchMoreArgs<TArgs, TGraphQLDataObject>['updateResults']
): InfiniteScrollQueryContext<TDatum, TArgs, TGraphQLDataObject> {
  const [data, setData] = useState<TDatum[] | undefined>(undefined);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [fetchMoreCallCount, incrementFetchMoreCallCount] = useReducer(
    (count: number) => count + 1,
    0
  );
  const fetchMoreOffset = initialLimit + fetchMoreCallCount * fetchMoreLimit;

  const onCompleted: (raw: TGraphQLDataObject) => void = useCallback(
    (raw) => {
      const rawDataArray: TGraphQLElement[] | undefined = listExtractor(raw);
      if (rawDataArray !== undefined) setData(rawDataArray.map((e) => transformer(e, raw)));
    },
    [listExtractor, transformer, setData]
  );

  const [apolloQuery, context] = hook({
    variables: { ...variables, limit: initialLimit, offset: 0 },
    onCompleted: onCompleted,
  });

  const query: LazyQueryContext<TDatum, TArgs, TGraphQLDataObject>['query'] = useCallback(
    (v?: TArgs) =>
      apolloQuery({
        variables: { ...variables, ...v, limit: initialLimit, offset: 0 },
        onCompleted: onCompleted,
      }),
    [variables, apolloQuery, onCompleted, initialLimit]
  );

  const fetchMore: () => void = useCallback(() => {
    async function runFetch() {
      context.fetchMore({
        variables: {
          ...variables,
          limit: fetchMoreLimit,
          offset: fetchMoreOffset,
        },
        updateQuery: (p, { fetchMoreResult }) => {
          const rawDataArray: TGraphQLElement[] | undefined = listExtractor(fetchMoreResult);
          setHasMore(rawDataArray != null && rawDataArray.length > 0);
          return mergeResultsFunction(p, fetchMoreResult);
        },
      });
    }

    runFetch();
    incrementFetchMoreCallCount();
  }, [
    context,
    variables,
    fetchMoreLimit,
    fetchMoreOffset,
    mergeResultsFunction,
    setHasMore,
    listExtractor,
  ]);

  return {
    data: data,
    loading: context.loading,
    error: context.error,
    refetch: context.refetch,
    fetchMore: fetchMore,
    query: query,
    hasMore: hasMore,
  };
}

export interface LazyQueryContext<TData, TArgs, TGraphQLData>
  extends QueryContext<TData, TArgs, TGraphQLData> {
  query: (variables?: TArgs) => void;
}

export function useApolloLazyQueryWithTransform<TData, TArgs = void, TGraphQLData = void>(
  hook: (
    baseOptions: LazyQueryHookOptions<TGraphQLData, TArgs>
  ) => LazyQueryResultTuple<TGraphQLData, TArgs>,
  variables: TArgs,
  transformer: (raw: TGraphQLData) => TData
): LazyQueryContext<TData, TArgs, TGraphQLData> {
  const [data, setData] = useState<TData | undefined>(undefined);

  const onCompleted: (raw: TGraphQLData) => void = useCallback(
    (raw) => {
      setData(transformer(raw));
    },
    [transformer, setData]
  );

  const [apolloQuery, context] = hook({ variables: variables, onCompleted: onCompleted });

  const query: LazyQueryContext<TData, TArgs, TGraphQLData>['query'] = useCallback(
    (v?: TArgs) => apolloQuery({ variables: { ...variables, ...v }, onCompleted: onCompleted }),
    [variables, apolloQuery, onCompleted]
  );

  const fetchMore: (args: FetchMoreArgs<TArgs, TGraphQLData>) => void = useCallback(
    (args) => {
      async function runFetch() {
        context.fetchMore({
          variables: { ...variables, ...args.variables },
          updateQuery: (p, { fetchMoreResult }) => args.updateResults(p, fetchMoreResult),
        });
      }

      runFetch();
    },
    [context, variables]
  );

  return {
    data: data,
    loading: context.loading,
    error: context.error,
    refetch: context.refetch,
    fetchMore: fetchMore,
    query: query,
  };
}

export function useApolloQueryWithTransform<TData, TArgs = void, TGraphQLData = void>(
  hook: (baseOptions: QueryHookOptions<TGraphQLData, TArgs>) => QueryResult<TGraphQLData, TArgs>,
  variables: TArgs,
  transformer: (raw: TGraphQLData) => TData
): QueryContext<TData, TArgs, TGraphQLData> {
  const [data, setData] = useState<TData | undefined>(undefined);

  const context: QueryResult<TGraphQLData, TArgs> = useMemo(() => {
    return hook({
      variables: variables,
      onCompleted: (raw: TGraphQLData) => {
        setData(transformer(raw));
      },
    });
  }, [hook, variables, transformer]);

  const fetchMore: (args: FetchMoreArgs<TArgs, TGraphQLData>) => void = useCallback(
    (args) => {
      async function runFetch() {
        context.fetchMore({
          variables: { ...variables, ...args.variables },
          updateQuery: (p, { fetchMoreResult }) => args.updateResults(p, fetchMoreResult),
        });
      }

      runFetch();
    },
    [context, variables]
  );

  return {
    data: data,
    loading: context.loading,
    error: context.error,
    refetch: context.refetch,
    fetchMore: fetchMore,
  };
}

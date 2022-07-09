import {
  LazyQueryHookOptions,
  LazyQueryResult,
  LazyQueryResultTuple,
  QueryHookOptions,
  QueryResult,
} from '@apollo/client';
import { useCallback, useMemo, useState } from 'react';

export interface QueryContext<TData, TArgs = void, TGraphQLData = void> {
  data: TData | undefined;
  loading: boolean;
  error?: Error | undefined;
  refetch: () => void;
  fetchMore: (args: FetchMoreArgs<TArgs, TGraphQLData>) => void;
}

export interface LazyQueryContext<TData, TArgs = void, TGraphQLData = void>
  extends QueryContext<TData, TArgs, TGraphQLData> {
  query: (variables?: TArgs) => void;
}

interface FetchMoreArgs<TArgs, TGraphQLData> {
  variables: TArgs;
  updateResults: (prev: TGraphQLData, more: TGraphQLData | null | undefined) => TGraphQLData;
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

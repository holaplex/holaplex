import {
  LazyQueryHookOptions,
  LazyQueryResult,
  LazyQueryResultTuple,
  QueryHookOptions,
  QueryResult,
} from '@apollo/client';
import { useCallback, useMemo, useState } from 'react';

export interface QueryContext<V, P = void, R = void> {
  data: V | undefined;
  loading: boolean;
  error?: Error | undefined;
  refetch: () => void;
  fetchMore: (args: FetchMoreArgs<P, R>) => void;
}

export interface LazyQueryContext<V, P = void, R = void> extends QueryContext<V, P, R> {
  query: (variables: P) => void;
}

interface FetchMoreArgs<P, R> {
  variables: P;
  updateResults: (prev: R, more: R | null | undefined) => R;
}

export function useApolloLazyQueryWithTransform<V, P = void, R = void>(
  hook: (baseOptions: LazyQueryHookOptions<R, P>) => LazyQueryResultTuple<R, P>,
  variables: P,
  transformer: (raw: R) => V,
): LazyQueryContext<V, P, R> {
  const [data, setData] = useState<V | undefined>(undefined);

  const [query, context]: [LazyQueryContext<V, P, R>['query'], LazyQueryResult<R, P>] = useMemo(() => {
    const hookArgs = {
      variables: variables,
      onCompleted: (raw: R) => {
        setData(transformer(raw));
      },
    };
    const [apolloQuery, context] = hook(hookArgs);
    return [(v: P) => apolloQuery(hookArgs), context];
  }, [hook, variables, transformer]);

  const fetchMore: (args: FetchMoreArgs<P, R>) => void = useCallback((args) => {
    async function runFetch() {
      context.fetchMore({
        variables: { ...variables, ...args.variables },
        updateQuery: (p, { fetchMoreResult }) => args.updateResults(p, fetchMoreResult)
      });
    }

    runFetch();
  }, [context, variables]);

  return {
    data: data,
    loading: context.loading,
    error: context.error,
    refetch: context.refetch,
    fetchMore: fetchMore,
    query: query,
  };
}

export function useApolloQueryWithTransform<V, P = void, R = void>(
  hook: (baseOptions: QueryHookOptions<R, P>) => QueryResult<R, P>,
  variables: P,
  transformer: (raw: R) => V,
): QueryContext<V, P, R> {
  const [data, setData] = useState<V | undefined>(undefined);

  const context: QueryResult<R, P> = useMemo(() => {
    return hook({
      variables: variables,
      onCompleted: (raw: R) => {
        setData(transformer(raw));
      },
    });
  }, [hook, variables, transformer]);

  const fetchMore: (args: FetchMoreArgs<P, R>) => void = useCallback((args) => {
    async function runFetch() {
      context.fetchMore({
        variables: { ...variables, ...args.variables },
        updateQuery: (p, { fetchMoreResult }) => args.updateResults(p, fetchMoreResult)
      });
    }

    runFetch();
  }, [context, variables]);

  return {
    data: data,
    loading: context.loading,
    error: context.error,
    refetch: context.refetch,
    fetchMore: fetchMore,
  };
}

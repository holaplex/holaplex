import { Program } from '@holaplex/graph-program';
import { Connection, PublicKey } from '@solana/web3.js';
import { useQuery } from 'react-query';
import * as anchor from '@project-serum/anchor';

import { getTwitterHandle } from './useTwitterHandle';
import { useAllConnectionsToQuery } from 'src/graphql/indexerTypes';
import { useEffect, useState } from 'react';

export const ALL_CONNECTIONS_TO = `allConnectionsTo`;

const memcmpFn = (publicKey: string) => ({
  offset: 8 + 32,
  bytes: new PublicKey(publicKey).toBase58(),
});

const INFINITE_SCROLL_AMOUNT_INCREMENT = 15;

export const useGetAllResultsWithoutPagination = (pubKey: string) => {
  // will be refactored
  const [hasMore, setHasMore] = useState(true);
  const { data, loading, fetchMore } = useAllConnectionsToQuery({
    variables: { to: pubKey, limit: INFINITE_SCROLL_AMOUNT_INCREMENT },
  });

  const [connections, setConnections] = useState(data?.connections || []);

  useEffect(() => {
    async function loadMore() {
      console.log('load more');
      fetchMore({
        variables: {
          to: pubKey,
          limit: INFINITE_SCROLL_AMOUNT_INCREMENT,
          offset: connections.length + INFINITE_SCROLL_AMOUNT_INCREMENT,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          const prevResuls = connections; // prev.feedEvents;
          const moreResults = fetchMoreResult.connections;
          if (moreResults.length === 0) {
            setHasMore(false);
          }

          fetchMoreResult.connections = prevResuls.concat(moreResults);
          setConnections(prevResuls.concat(moreResults));
          return { ...fetchMoreResult };
        },
      });
    }

    console.log('effect connections', {
      connections,
      limit: INFINITE_SCROLL_AMOUNT_INCREMENT,
      offset: connections.length + INFINITE_SCROLL_AMOUNT_INCREMENT,
      loading,
    });

    if (!hasMore) return;

    loadMore();
  }, [loading, fetchMore]);

  return { data };
};

export const useGetAllQueryResultsWithoutPagination = (query: any, variables: any) => {
  // will be refactored
  const [hasMore, setHasMore] = useState(true);
  const { data, loading, fetchMore } = query({
    variables: { ...variables, limit: INFINITE_SCROLL_AMOUNT_INCREMENT },
  });

  useEffect(() => {
    async function loadMore() {
      fetchMore({
        variables: {
          ...variables,
          limit: INFINITE_SCROLL_AMOUNT_INCREMENT,
          offset: data?.connections?.length + INFINITE_SCROLL_AMOUNT_INCREMENT,
        },
        updateQuery: (prev: any, { fetchMoreResult }: any) => {
          if (!fetchMoreResult) return prev;
          const prevResuls = data?.connections; // prev.feedEvents;
          const moreResults = fetchMoreResult.connections;
          if (moreResults.length === 0) {
            setHasMore(false);
          }

          fetchMoreResult.connections = prevResuls.concat(moreResults);

          return { ...fetchMoreResult };
        },
      });
    }

    if (!hasMore || !data) return;

    loadMore();
  }, [loading, fetchMore]);

  return { data };
};

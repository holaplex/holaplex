import React, { useState } from 'react';
import { useAllConnectionsFromQuery, useFeedQuery } from 'src/graphql/indexerTypes';

const INFINITE_SCROLL_AMOUNT_INCREMENT = 25;

export default function Alpha(props: { pubkey: string }) {
  const { data, loading, fetchMore } = useFeedQuery({
    variables: {
      address: props.pubkey,
      offset: 0,
      limit: INFINITE_SCROLL_AMOUNT_INCREMENT,
    },
  });

  const { data: myConnectionsFromData } = useAllConnectionsFromQuery({
    variables: {
      from: props.pubkey,
    },
  });

  const [hasMoreFeedEvents, setHasMoreFeedEvents] = useState(true);

  return <div>Alpha</div>;
}

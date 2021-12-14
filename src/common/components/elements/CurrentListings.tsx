import React, { useState, useEffect, useReducer } from 'react';
import { List, Row, Space, Typography } from 'antd';
import { Listing, ListingPreview, SkeletonListing, generateListingShell } from './ListingPreview';
import { DiscoveryRadioDropdown } from './ListingsSortAndFilter';
import { callMetaplexIndexerRPC } from '@/modules/utils/callMetaplexIndexerRPC';
import { NextRouter, useRouter } from 'next/router';
import useInfiniteScroll from 'react-infinite-scroll-hook';

const { Title } = Typography;

const pageSize = 12;

const FilterValues = ['SHOW_ALL', 'BUY_NOW', 'ACTIVE_AUCTIONS'] as const;
type FilterAction = typeof FilterValues[number]; // keyof typeof filterFns;

const SortByValues = [
  'RECENTLY_LISTED',
  'RECENT_BID',
  'PRICE_HIGH_TO_LOW',
  'PRICE_LOW_TO_HIGH',
  'ENDING_SOONEST',
] as const;
type SortByAction = typeof SortByValues[number]; // keyof typeof sortByFns;

export interface DiscoveryToolState {
  allListings: Listing[];
  filteredListings: Listing[];
  listingsOnDisplay: Listing[];
  cursor: number;
  filters: FilterAction[];
  sortBy: SortByAction; //  SortingActions;
}

export type FilterOption = { value: FilterAction[]; label: string };
const filterOptions: FilterOption[] = [
  { value: ['SHOW_ALL'], label: 'Show all' },
  { value: ['ACTIVE_AUCTIONS'], label: 'Active auctions' },
  { value: ['BUY_NOW'], label: 'Buy now' },
];

const filterFns: {
  [fnName in FilterAction]: (l: Listing) => boolean;
} = {
  SHOW_ALL: (l) => true,
  BUY_NOW: (l) => !l.ends_at,
  ACTIVE_AUCTIONS: (l) => !!l.ends_at,
};

const sortByFns: {
  [fnName in SortByAction]: (a: Listing, b: Listing) => number;
} = {
  RECENTLY_LISTED: (a, b) => a.created_at.localeCompare(b.created_at),
  RECENT_BID: (a, b) => {
    if (!a.last_bid || !b.last_bid) return -1;
    return a.last_bid - b.last_bid;
  },
  PRICE_HIGH_TO_LOW: (a, b) => {
    const aPrice = a.price_floor || a.instant_sale_price || 0;
    const bPrice = b.price_floor || b.instant_sale_price || 0;
    return bPrice - aPrice;
  },
  PRICE_LOW_TO_HIGH: (a, b) => {
    const aPrice = a.price_floor || a.instant_sale_price || 0;
    const bPrice = b.price_floor || b.instant_sale_price || 0;
    return aPrice - bPrice;
  },
  ENDING_SOONEST: (a, b) => a.ends_at?.localeCompare(b.ends_at || '') || -1,
};

export type SortingOption = { value: SortByAction; label: string };
const sortingOptions: SortingOption[] = [
  { value: 'RECENT_BID', label: 'Recent bids' },
  { value: 'PRICE_HIGH_TO_LOW', label: 'Expensive' },
  { value: 'PRICE_LOW_TO_HIGH', label: 'Cheap' },
  { value: 'ENDING_SOONEST', label: 'Ending soonest' },
  { value: 'RECENTLY_LISTED', label: 'Recent listings' },
];

export type DiscoveryToolAction =
  | {
      type: 'INITIALIZE_LISTINGS';
      payload: Listing[];
    }
  | {
      type: 'LOAD_MORE_LISTINGS';
    }
  | {
      type: 'FILTER';
      payload: (keyof typeof filterFns)[];
    }
  | {
      type: 'SORT';
      payload: keyof typeof sortByFns;
    };

const initialState = (options?: {
  filters?: FilterAction[];
  sortBy?: SortByAction;
}): DiscoveryToolState => {
  const listingShells = Array(8)
    .fill(null)
    .map((_, i) => generateListingShell(i.toString()));
  return {
    allListings: listingShells,
    filteredListings: listingShells,
    listingsOnDisplay: listingShells,
    cursor: 0,
    // Array(8)
    //   .fill(null)
    //   .map((_, i) => generateListingShell(i.toString())),
    filters: options?.filters || [],
    sortBy: options?.sortBy || 'RECENTLY_LISTED',
  };
};

function reducer(state: DiscoveryToolState, action: DiscoveryToolAction): DiscoveryToolState {
  console.log(action.type, { prevState: state });
  switch (action.type) {
    case 'INITIALIZE_LISTINGS':
      return {
        ...state,
        allListings: action.payload,
        filteredListings: action.payload.sort(sortByFns[state.sortBy]),
        listingsOnDisplay: [],
      };
    case 'LOAD_MORE_LISTINGS':
      const newCursor = state.cursor + pageSize;

      return {
        ...state,
        cursor: newCursor, // nr of items
        listingsOnDisplay: [
          ...state.listingsOnDisplay,
          ...state.filteredListings.slice(state.cursor, newCursor),
        ],
      };
    case 'FILTER':
      const filteredListings = state.allListings
        .filter((listing) => action.payload.every((filter) => filterFns[filter](listing)))
        .sort(sortByFns[state.sortBy]);

      return {
        ...state,
        cursor: 0,
        filters: [...new Set(state.filters.concat(action.payload))], // de-duped filters
        filteredListings: filteredListings,
        listingsOnDisplay: filteredListings.slice(0, pageSize),
      };
    case 'SORT':
      const sortedListings = state.filteredListings.sort(sortByFns[action.payload]);
      return {
        ...state,
        cursor: 0,
        sortBy: action.payload,
        filteredListings: sortedListings,
        listingsOnDisplay: sortedListings.slice(0, pageSize),
      };
    default:
      throw new Error('Not a valid action for state');
  }
}

export function CurrentListings() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  //Example query ?search=hello&filters=active_auctions,&sort_by=ending_soonest
  const queryFilters: string[] =
    (router.query['filters[]'] as string[]) || (router.query.filters as string)?.split(',') || [];
  const querySortBy = (router.query.sort as string) || 'recently_listed';

  const querySearch = router.query.search || '';

  const validFilters = queryFilters
    .map((qf) => qf.toUpperCase())
    .filter((qf) => FilterValues.includes(qf as any)) as FilterAction[];

  const validSortBy = (
    SortByValues.includes(querySortBy.toUpperCase() as any)
      ? querySortBy.toUpperCase()
      : 'RECENTLY_LISTED'
  ) as SortByAction;

  const [state, dispatch] = useReducer(
    reducer,
    initialState({
      filters: validFilters,
      sortBy: validSortBy,
    })
  );

  const loadMoreData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    dispatch({ type: 'LOAD_MORE_LISTINGS' });
    setLoading(false);
  };

  // get all listings initially
  useEffect(() => {
    async function getListings() {
      const allListings = await callMetaplexIndexerRPC('getListings');
      dispatch({ type: 'INITIALIZE_LISTINGS', payload: allListings });

      loadMoreData();
    }

    getListings();
  }, []);

  const hasNextPage = state.listingsOnDisplay.length < state.filteredListings.length;
  const [sentryRef] = useInfiniteScroll({
    loading,
    hasNextPage,
    onLoadMore: () => dispatch({ type: 'LOAD_MORE_LISTINGS' }),
    // When there is an error, we stop infinite loading.
    // It can be reactivated by setting "error" state as undefined.
    // disabled: false || !!error, //  !!error,

    // `rootMargin` is passed to `IntersectionObserver`.
    // We can use it to trigger 'onLoadMore' when the sentry comes near to become
    // visible, instead of becoming fully visible on the screen.
    rootMargin: '0px 0px 400px 0px',
  });

  return (
    <>
      <Row justify="space-between" align="middle" style={{ marginBottom: 30 }}>
        <Title level={3}>Current listings</Title>
        <Space direction="horizontal">
          <DiscoveryRadioDropdown
            label="Filter"
            action="FILTER"
            value={state.filters}
            options={filterOptions}
            dispatch={dispatch}
          />
          <DiscoveryRadioDropdown
            label="Sort"
            action="SORT"
            value={state.sortBy}
            options={sortingOptions}
            dispatch={dispatch}
          />
        </Space>
      </Row>

      <List
        grid={{
          xs: 1,
          sm: 1,
          md: 3,
          lg: 3,
          xl: 4,
          xxl: 4,
          gutter: 24,
        }}
        dataSource={state.listingsOnDisplay}
        renderItem={(listing, i) => (
          <List.Item key={listing?.address || i}>
            {!listing.subdomain ? <SkeletonListing /> : <ListingPreview {...listing} />}
          </List.Item>
        )}
      />
      <div ref={sentryRef}></div>
      {/* Perpetual loading state at the bottom */}
      {/* Could probaly render it conditionally by looking at hasNextPage */}
      <List
        grid={{
          xs: 1,
          sm: 1,
          md: 3,
          lg: 3,
          xl: 4,
          xxl: 4,
          gutter: 24,
        }}
        dataSource={Array(4).fill({})}
        renderItem={(_, i) => (
          <List.Item key={i}>
            <SkeletonListing />
          </List.Item>
        )}
      />
    </>
  );
}

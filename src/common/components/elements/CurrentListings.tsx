import React, { useState, useEffect, useReducer, useRef } from 'react';
import { Affix, BackTop, Button, List, Row, Space, Typography } from 'antd';
import {
  Listing,
  ListingPreview,
  SkeletonListing,
  generateListingShell,
  getListingPrice,
} from './ListingPreview';
import { DiscoveryFiltersAndSortBy } from './ListingsSortAndFilter';
import { callMetaplexIndexerRPC } from '@/modules/utils/callMetaplexIndexerRPC';
import { NextRouter, useRouter } from 'next/router';
import useInfiniteScroll from 'react-infinite-scroll-hook';

const { Title } = Typography;

const pageSize = 12;

const FilterValues = ['SHOW_ALL', 'BUY_NOW', 'ACTIVE_AUCTIONS', 'HAS_1+_BIDS'] as const;
export type FilterAction = typeof FilterValues[number]; // keyof typeof filterFns;

export const SortByAuctionValues = ['RECENT_BID', 'ENDING_SOONEST', 'MOST_BIDS'] as const;

const SortByValues = [
  'RECENTLY_LISTED',
  'PRICE_HIGH_TO_LOW',
  'PRICE_LOW_TO_HIGH',
  ...SortByAuctionValues,
] as const;
export type SortByAction = typeof SortByValues[number]; // keyof typeof sortByFns;

export interface DiscoveryToolState {
  allListings: Listing[];
  filteredAndSortedListings: Listing[];
  listingsOnDisplay: Listing[];
  cursor: number;
  filters: FilterAction[];
  sortBy: SortByAction; //  SortingActions;
}

export type FilterOption = { value: FilterAction; label: string };
const filterOptions: FilterOption[] = [
  { value: 'SHOW_ALL', label: 'Show all' },
  { value: 'ACTIVE_AUCTIONS', label: 'Active auctions' },
  { value: 'BUY_NOW', label: 'Buy now' },
  { value: 'HAS_1+_BIDS', label: 'Has bids' },
];

const filterFns: {
  [fnName in FilterAction]: (l: Listing) => boolean;
} = {
  SHOW_ALL: (l) => true,
  BUY_NOW: (l) => !l.endsAt,
  ACTIVE_AUCTIONS: (l) => !!l.endsAt,
  'HAS_1+_BIDS': (l) => !!l.endsAt && !!l.totalUncancelledBids, // !!l.total_uncancelled_bids is true if it exists and is not 0
};

const sortByFns: {
  [fnName in SortByAction]: (a: Listing, b: Listing) => number;
} = {
  MOST_BIDS: (a, b) => (b.totalUncancelledBids || 0) - (a.totalUncancelledBids || 0), // If many auctions only have 1 bid
  RECENTLY_LISTED: (a, b) => b.createdAt.localeCompare(a.createdAt),
  RECENT_BID: (a, b) => {
    if (!a.lastBidTime) return 1;
    return b.lastBidTime ? b.lastBidTime.localeCompare(a.lastBidTime) : -1;
  },
  PRICE_HIGH_TO_LOW: (a, b) => getListingPrice(b) - getListingPrice(a),
  PRICE_LOW_TO_HIGH: (a, b) => getListingPrice(a) - getListingPrice(b),
  ENDING_SOONEST: (a, b) => {
    if (!a.endsAt) return 1;
    return b.endsAt ? a.endsAt.localeCompare(b.endsAt) : -1;
  },
};

export type SortingOption = { value: SortByAction; label: string };
const sortingOptions: SortingOption[] = [
  { value: 'RECENTLY_LISTED', label: 'Recent listings' },
  { value: 'PRICE_HIGH_TO_LOW', label: 'Expensive' },
  { value: 'PRICE_LOW_TO_HIGH', label: 'Cheap' },
  { value: 'RECENT_BID', label: 'Recent bids' },
  { value: 'MOST_BIDS', label: 'Most bids' },
  { value: 'ENDING_SOONEST', label: 'Ending soonest' },
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
      payload: FilterAction;
    }
  | {
      type: 'SORT';
      payload: SortByAction;
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
    filteredAndSortedListings: listingShells,
    listingsOnDisplay: listingShells,
    cursor: 0,
    // Array(8)
    //   .fill(null)
    //   .map((_, i) => generateListingShell(i.toString())),
    filters: options?.filters || ['ACTIVE_AUCTIONS'],
    sortBy: options?.sortBy || 'MOST_BIDS',
  };
};

function filterAndSortListings(listings: Listing[], filters: FilterAction[], sortBy: SortByAction) {
  return listings
    .filter((listing) => filters.some((filter) => filterFns[filter](listing)))
    .sort(sortByFns[sortBy]);
}

function reducer(state: DiscoveryToolState, action: DiscoveryToolAction): DiscoveryToolState {
  switch (action.type) {
    case 'INITIALIZE_LISTINGS':
      return {
        ...state,
        allListings: action.payload,
        filteredAndSortedListings: filterAndSortListings(
          action.payload,
          state.filters,
          state.sortBy
        ),
        listingsOnDisplay: [],
      };
    case 'LOAD_MORE_LISTINGS':
      const newCursor = state.cursor + pageSize;
      const listings = new Set([
        ...state.listingsOnDisplay,
        ...state.filteredAndSortedListings.slice(state.cursor, newCursor),
      ]);

      return {
        ...state,
        cursor: newCursor,
        listingsOnDisplay: Array.from(listings),
      };
    case 'FILTER':
      const incomingFilter = action.payload;
      let filters: FilterAction[];
      if (incomingFilter === 'SHOW_ALL') {
        filters = [incomingFilter];
      } else {
        filters = (
          state.filters.includes(incomingFilter)
            ? state.filters.filter((f) => f !== incomingFilter)
            : state.filters.concat([incomingFilter])
        ).filter((f) => f !== 'SHOW_ALL');
      }
      if (!filters.length) filters = ['SHOW_ALL'];

      const onlyBuyNow = filters.length === 1 && filters[0] === 'BUY_NOW';
      const sortBy =
        // @ts-ignore
        onlyBuyNow && SortByAuctionValues.includes(state.sortBy) ? 'RECENTLY_LISTED' : state.sortBy;

      const filteredAndSortedListings = filterAndSortListings(state.allListings, filters, sortBy);

      return {
        ...state,
        cursor: 0,
        filters,
        sortBy,
        filteredAndSortedListings: filteredAndSortedListings,
        listingsOnDisplay: filteredAndSortedListings.slice(0, pageSize),
      };
    case 'SORT':
      const sortedListings = state.filteredAndSortedListings.sort(sortByFns[action.payload]);
      return {
        ...state,
        cursor: 0,
        sortBy: action.payload,
        filteredAndSortedListings: sortedListings,
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
  const querySortBy = (router.query.sort as string) || 'most_bids';

  const querySearch = router.query.search || '';

  const validFilters = queryFilters
    .map((qf) => qf.toUpperCase())
    .filter((qf) => FilterValues.includes(qf as any)) as FilterAction[];

  const validSortBy = (
    SortByValues.includes(querySortBy.toUpperCase() as any)
      ? querySortBy.toUpperCase()
      : 'MOST_BIDS'
  ) as SortByAction;

  const [state, dispatch] = useReducer(
    reducer,
    initialState({
      filters: validFilters.length ? validFilters : ['ACTIVE_AUCTIONS'],
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

  const hasNextPage = state.listingsOnDisplay.length < state.filteredAndSortedListings.length;
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
  // const [container, setContainer] = useState<HTMLDivElement | Window>(window);
  const CurrentListingsRef = useRef<HTMLDivElement>(null);

  return (
    <div id="current-listings" ref={CurrentListingsRef} style={{ position: 'relative' }}>
      <Row
        justify="space-between"
        align="middle"
        style={{
          marginBottom: 30,
          background: 'black',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <Title level={3}>
          Current Listings
          {/* ({state.filteredAndSortedListings.length -
              new Set(state.filteredAndSortedListings.map((l) => l.listingAddress)).size}{' '}
            duplicates){' '} */}
        </Title>
        {/* <Space direction="horizontal">
          <DiscoveryFilterDropdown
            label="Filter"
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
        </Space> */}
        <DiscoveryFiltersAndSortBy
          sortBy={state.sortBy}
          filters={state.filters}
          allFilterOptions={filterOptions}
          allSortByOptions={sortingOptions}
          dispatch={dispatch}
        />
      </Row>

      <List
        grid={{
          xs: 1,
          sm: 2,
          md: 3,
          lg: 3,
          xl: 4,
          xxl: 4,
          gutter: 24,
        }}
        dataSource={state.listingsOnDisplay}
        renderItem={(listing, i) => (
          <List.Item key={listing?.listingAddress || i}>
            {!listing.subdomain ? <SkeletonListing /> : <ListingPreview {...listing} />}
          </List.Item>
        )}
      />
      <div ref={sentryRef}></div>
      {/* Perpetual loading state at the bottom */}
      {/* Could probaly render it conditionally by looking at hasNextPage */}
      {hasNextPage ? (
        <List
          grid={{
            xs: 1,
            sm: 2,
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
      ) : (
        <div>All done for now 🎉</div>
        // Back to top?
      )}
      {/* <Button style={{ position: 'sticky', bottom: 10, right: 25 }}>Back to top</Button> */}
      {/* <BackTop target={() => CurrentListingsRef.current} /> */}
    </div>
  );
}

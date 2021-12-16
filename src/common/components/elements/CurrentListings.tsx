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
import { Flex } from 'antd-mobile';

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
  { value: 'SHOW_ALL', label: 'All listings' },
  { value: 'ACTIVE_AUCTIONS', label: 'Auctions' },
  { value: 'BUY_NOW', label: 'Buy now' },
  // { value: 'HAS_1+_BIDS', label: 'Has Bids' },
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
  // Most_bids could be renamed to trending
  MOST_BIDS: (a, b) =>
    (b.totalUncancelledBids || 0) - (a.totalUncancelledBids || 0) || sortByFns.ENDING_SOONEST(a, b), // If many auctions only have 1 bid
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
  { value: 'RECENTLY_LISTED', label: 'New' },
  { value: 'MOST_BIDS', label: 'Trending' },
  { value: 'PRICE_HIGH_TO_LOW', label: 'High to low' },
  // { value: 'PRICE_HIGH_TO_LOW', label: 'Price - High to low' },
  // { value: 'PRICE_HIGH_TO_LOW', label: 'Sol - High to low' },
  // { value: 'PRICE_HIGH_TO_LOW', label: '◎ - High to low' },
  { value: 'PRICE_LOW_TO_HIGH', label: 'Low to high' },
  // { value: 'RECENT_BID', label: 'Recent Bids' },
  { value: 'ENDING_SOONEST', label: 'Ending soon' },
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

// would have liked to use a ref, but I don't know how to access that from inside the reducer
// const scrollToTopOfListings = () => document.getElementById('current-listings')?.scrollIntoView();
// scroll behaviour smooth can look cool, but it sometimes leads to extra listings being rendered because the infinte scroll hook is triggered "on the way up"
const scrollToTopOfListings = () =>
  document.getElementById('current-listings')?.scrollIntoView({
    behavior: 'smooth',
  });

const initialState = (options: {
  filters: FilterAction[];
  sortBy: SortByAction;
}): DiscoveryToolState => {
  const listingShells = Array(8)
    .fill(null)
    .map((_, i) => generateListingShell(i.toString()));
  return {
    allListings: listingShells,
    filteredAndSortedListings: listingShells,
    listingsOnDisplay: listingShells,
    cursor: 0,
    filters: options.filters,
    sortBy: options.sortBy,
  };
};

export function filterAndSortListings(
  listings: Listing[],
  filters: FilterAction[],
  sortBy: SortByAction
) {
  return listings
    .filter((listing) => !filters.length || filters.some((filter) => filterFns[filter](listing)))
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
        cursor: 0,
        listingsOnDisplay: [],
      };
    case 'LOAD_MORE_LISTINGS':
      const newCursor = state.cursor + pageSize;
      const listings = [
        ...state.listingsOnDisplay,
        ...state.filteredAndSortedListings.slice(state.cursor, newCursor),
      ];

      return {
        ...state,
        cursor: newCursor,
        listingsOnDisplay: listings,
      };
    case 'FILTER':
      const incomingFilter = action.payload;
      const filters = [incomingFilter];
      // don't remove this comment plz // Kris
      // let filters: FilterAction[];
      // if (incomingFilter === 'SHOW_ALL') {
      //   filters = [incomingFilter];
      // } else {
      //   filters = (
      //     state.filters.includes(incomingFilter)
      //       ? state.filters.filter((f) => f !== incomingFilter)
      //       : state.filters.concat([incomingFilter])
      //   ).filter((f) => f !== 'SHOW_ALL');
      // }
      // if (!filters.length) filters = ['SHOW_ALL'];

      const onlyBuyNow = filters.length === 1 && filters[0] === 'BUY_NOW';
      const sortBy =
        // @ts-ignore
        onlyBuyNow && SortByAuctionValues.includes(state.sortBy) ? 'RECENTLY_LISTED' : state.sortBy;

      const filteredAndSortedListings = filterAndSortListings(state.allListings, filters, sortBy);
      scrollToTopOfListings();

      return {
        ...state,
        cursor: pageSize,
        filters,
        sortBy,
        filteredAndSortedListings: filteredAndSortedListings,
        listingsOnDisplay: filteredAndSortedListings.slice(0, pageSize),
      };
    case 'SORT':
      const sortedListings = state.filteredAndSortedListings.sort(sortByFns[action.payload]);
      scrollToTopOfListings();

      return {
        ...state,
        cursor: pageSize,
        sortBy: action.payload,
        filteredAndSortedListings: sortedListings,
        listingsOnDisplay: sortedListings.slice(0, pageSize),
      };
    default:
      throw new Error('Not a valid action for state');
  }
}

export function CurrentListings(props: { allListings: Listing[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  //Example query ?search=hello&filters=active_auctions,&sort_by=ending_soonest
  const queryFilters: string[] =
    (router.query['filters[]'] as string[]) || (router.query.filters as string)?.split(',') || [];
  const querySortBy = (router.query.sort as string) || '';

  const querySearch = router.query.search || '';

  const validFilters = queryFilters
    .map((qf) => qf.toUpperCase())
    .filter((qf) => FilterValues.includes(qf as any)) as FilterAction[];

  const validSortBy = (
    SortByValues.includes(querySortBy.toUpperCase() as any)
      ? querySortBy.toUpperCase()
      : 'MOST_BIDS'
  ) as SortByAction;

  // turns out the query is only parsed after a few renders, and don't make it into the initial state :(
  // will need to put it in useEffect probably
  // console.log({
  //   querySearch,
  //   queryFilters,
  //   querySortBy,
  //   validFilters,
  //   validSortBy,
  // });

  // lazy load initial state, otherwise it is run on every render :O
  const [state, dispatch] = useReducer(reducer, null, () =>
    initialState({
      filters: validFilters.length ? validFilters : ['ACTIVE_AUCTIONS'],
      sortBy: validSortBy,
    })
  );

  const loadMoreData = () => {
    console.log('load more data');
    if (loading) {
      return;
    }
    setLoading(true);
    dispatch({ type: 'LOAD_MORE_LISTINGS' });
    // artifical delay
    setTimeout(() => setLoading(false), 500);
  };

  const isDev = false && process.env.NODE_ENV === 'development';
  // get all listings initially
  useEffect(() => {
    if (props.allListings?.length <= 4) return;
    async function getListings() {
      const allListings = props.allListings
        ? props.allListings
        : await callMetaplexIndexerRPC('getListings');
      dispatch({ type: 'INITIALIZE_LISTINGS', payload: allListings });

      loadMoreData();
    }
    getListings();
  }, [props.allListings]);

  const hasNextPage = state.listingsOnDisplay.length < state.filteredAndSortedListings.length;
  const [sentryRef] = useInfiniteScroll({
    loading,
    hasNextPage,
    onLoadMore: () => loadMoreData(),
    // When there is an error, we stop infinite loading.
    // It can be reactivated by setting "error" state as undefined.
    // disabled: false || !!error, //  !!error,

    // `rootMargin` is passed to `IntersectionObserver`.
    // We can use it to trigger 'onLoadMore' when the sentry comes near to become
    // visible, instead of becoming fully visible on the screen.
    rootMargin: '0px 0px 400px 0px',
  });

  // will remove these soon
  // const nrOfDuplicatesDetected =
  //   state.filteredAndSortedListings.length -
  //   new Set(state.filteredAndSortedListings.map((l) => l.listingAddress)).size;

  // const nrOfDuplicatesDetectedOnDisplay =
  //   state.listingsOnDisplay.length -
  //   new Set(state.listingsOnDisplay.map((l) => l.listingAddress)).size;

  return (
    <div id="current-listings" style={{ position: 'relative' }}>
      <Row
        justify="space-between"
        align="middle"
        style={{
          marginBottom: 30,
          background: 'black',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          padding: '1rem 0',
          // box shadow covers up listing text that otherwise sticks through
          boxShadow: '0 0 0 2px #000',
        }}
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <Title
            level={3}
            style={{
              marginBottom: 0,
            }}
          >
            Current Listings
            {/* 
            {{' '}isDev && (
              <span>
                ({state.listingsOnDisplay.length + ' of ' + state.filteredAndSortedListings.length})
              </span>
            )}
            {isDev && <span>({nrOfDuplicatesDetected} filtered duplicates)</span>}
            {isDev && <span>({nrOfDuplicatesDetectedOnDisplay} duplicates on display)</span>} */}
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
        </div>
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

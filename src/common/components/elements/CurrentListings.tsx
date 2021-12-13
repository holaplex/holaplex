import React, { useState, useEffect, useReducer } from 'react';
import { List, message, Avatar, Skeleton, Divider, Row, Space, Typography } from 'antd';
import { Listing, ListingPreview, SkeletonListing } from './ListingPreview';
import { generateListingShell } from '@/common/constants/demoContent';
import { DiscoveryRadioDropdown } from './ListingsSortAndFilter';
import { callMetaplexIndexerRPC } from '@/modules/utils/callMetaplexIndexerRPC';
import { useRouter } from 'next/router';
import useInfiniteScroll from 'react-infinite-scroll-hook';

const { Title } = Typography;

const pageSize = 8;

type SortByAction = keyof typeof sortByFns;
type FilterAction = keyof typeof filterFns;

export interface DiscoveryToolState {
  listings: Listing[];
  filteredListings: Listing[];
  listingsOnDisplay: Listing[];
  cursor: number;
  filters: FilterAction[];
  sortBy: SortByAction; //  SortingActions;
}

const sortByFns = {
  SORT_BY_RECENTLY_LISTED: (a: Listing, b: Listing) => a.created_at.localeCompare(b.created_at),
  SORT_BY_RECENT_BID: (a: Listing, b: Listing) => {
    if (!a.last_bid || !b.last_bid) return -1;
    return a.last_bid - b.last_bid;
  },
  SORT_BY_PRICE_HIGH_TO_LOW: (a: Listing, b: Listing) => {
    const aPrice = a.price_floor || a.instant_sale_price || 0;
    const bPrice = b.price_floor || b.instant_sale_price || 0;
    return bPrice - aPrice;
  },
  SORT_BY_PRICE_LOW_TO_HIGH: (a: Listing, b: Listing) => {
    const aPrice = a.price_floor || a.instant_sale_price || 0;
    const bPrice = b.price_floor || b.instant_sale_price || 0;
    return aPrice - bPrice;
  },
  SORT_BY_ENDING_SOONEST: (a: Listing, b: Listing) =>
    a.ends_at?.localeCompare(b.ends_at || '') || -1,
};
export type SortingOption = { value: SortByAction; label: string };
const sortingOptions: SortingOption[] = [
  { value: 'SORT_BY_RECENT_BID', label: 'Recent bids' },
  { value: 'SORT_BY_PRICE_HIGH_TO_LOW', label: 'Expensive' },
  { value: 'SORT_BY_PRICE_LOW_TO_HIGH', label: 'Cheap' },
  { value: 'SORT_BY_ENDING_SOONEST', label: 'Ending soonest' },
  { value: 'SORT_BY_RECENTLY_LISTED', label: 'Recent listings' },
];

export type FilterOption = { value: FilterAction[]; label: string };
const filterOptions: FilterOption[] = [
  { value: ['FILTER_BY_SHOW_ALL'], label: 'Show all' },
  { value: ['FILTER_BY_ACTIVE_AUCTIONS'], label: 'Active auctions' },
  { value: ['FILTER_BY_BUY_NOW'], label: 'Buy now' },
];

const filterFns = {
  FILTER_BY_SHOW_ALL: (l: Listing) => true,
  FILTER_BY_BUY_NOW: (l: Listing) => !l.ends_at,
  FILTER_BY_ACTIVE_AUCTIONS: (l: Listing) => !!l.ends_at,
};

export type DiscoveryToolAction =
  | {
      type: 'SET_LISTINGS';
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
  listings?: Listing[];
  filters?: FilterAction[];
  sortBy?: SortByAction;
}): DiscoveryToolState => {
  return {
    listings: Array(8)
      .fill(null)
      .map((_, i) => generateListingShell(i.toString())),
    filteredListings: Array(8)
      .fill(null)
      .map((_, i) => generateListingShell(i.toString())),
    listingsOnDisplay: Array(8)
      .fill(null)
      .map((_, i) => generateListingShell(i.toString())),
    cursor: 0,
    // Array(8)
    //   .fill(null)
    //   .map((_, i) => generateListingShell(i.toString())),
    filters: options?.filters || [],
    sortBy: options?.sortBy || 'SORT_BY_RECENTLY_LISTED',
  };
};

function reducer(state: DiscoveryToolState, action: DiscoveryToolAction): DiscoveryToolState {
  console.log(action.type, { prevState: state });
  switch (action.type) {
    case 'SET_LISTINGS':
      return {
        ...state,
        listings: action.payload,
        filteredListings: action.payload.sort(sortByFns[state.sortBy]),
        listingsOnDisplay: [],
      };
    case 'LOAD_MORE_LISTINGS':
      const newCursor = state.cursor + pageSize;
      console.log('loading from', state.cursor, 'to', newCursor);
      return {
        ...state,
        cursor: newCursor, // nr of items
        listingsOnDisplay: [
          ...state.listingsOnDisplay,
          ...state.filteredListings.slice(state.cursor, newCursor),
        ],
      };
    case 'FILTER':
      const filteredListings = state.listings
        .filter((listing) => action.payload.every((filter) => filterFns[filter](listing)))
        .sort(sortByFns[state.sortBy]);
      return {
        ...state,
        cursor: 0,
        filters: [...new Set(state.filters.concat(action.payload))],
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
// props: { sortBy: string; filters: string[]; listings: Listing[] }
export function CurrentListings(props: { allListings?: Listing[] }) {
  const router = useRouter();

  //?search=hello&filters=active_auctions,&sort_by=ending_soonest
  const defaultSearch = router.query.search || '';
  // @ts-ignore
  const defaultFilters = router.query['filters[]'] || router.query.filters?.split(',') || [];
  const defaultFilters2 = router.query.filters2 || [];
  const defaultSort = router.query.sort || 'recent_listings';

  // console.log({
  //   defaultSearch,
  //   defaultFilters,
  //   defaultFilters2,
  //   defaultSort,
  // });

  const [loading, setLoading] = useState(false);
  // const [allListings, setAllListings] = useState<Listing[]>([]);
  // const [filteredListings, setfilteredListings] = useState<Listing[]>([]);
  // const [listingsOnDisplay, setlistingsOnDisplay] = useState<Listing[]>([]);

  const [cursor, setCursor] = useState(0);

  const [state, dispatch] = useReducer(
    reducer,
    initialState({
      filters: defaultFilters,
      // listings: props.allListings,
    })
  );

  //   dispatch({ type: 'SET_LISTINGS', payload: props.allListings });

  const loadMoreData = () => {
    console.log('load more data', {
      loading,
      state,
      props,
    });
    if (loading) {
      return;
    }
    setLoading(true);
    dispatch({ type: 'LOAD_MORE_LISTINGS' });
    setLoading(false);

    // new Promise((resolve) =>
    //   setTimeout(() => resolve(state.filteredListings.slice(cursor, cursor + pageSize)), 500)
    // )
    // fetch('https://randomuser.me/api/?results=10&inc=name,gender,email,nat,picture&noinfo')
    //   .then((res) => res.json())
    // @ts-ignore
    // .then((additionalListings: Listing[]) => {
    //   setlistingsOnDisplay([...listingsOnDisplay, ...additionalListings]);
    //   setCursor(cursor + pageSize);
    //   setLoading(false);
    // })
    // .catch((e) => {
    //   console.error(e);
    //   setLoading(false);
    // });
  };

  useEffect(() => {
    async function getListings() {
      const allListings = await callMetaplexIndexerRPC('getListings');
      const hotListings = allListings.sort((a, b) => a.created_at.localeCompare(b.created_at));
      const featuredListings = hotListings.splice(0, 4);
      dispatch({ type: 'SET_LISTINGS', payload: hotListings });

      loadMoreData();
    }

    getListings();
  }, []);

  const [sentryRef] = useInfiniteScroll({
    loading,
    hasNextPage: state.listingsOnDisplay.length < state.filteredListings.length,
    onLoadMore: () => dispatch({ type: 'LOAD_MORE_LISTINGS' }),
    // When there is an error, we stop infinite loading.
    // It can be reactivated by setting "error" state as undefined.
    disabled: false, //  !!error,
    // `rootMargin` is passed to `IntersectionObserver`.
    // We can use it to trigger 'onLoadMore' when the sentry comes near to become
    // visible, instead of becoming fully visible on the screen.
    rootMargin: '0px 0px 400px 0px',
  });

  // console.log('disco state', {
  //   dataLength: state.listingsOnDisplay.length,
  //   next: loadMoreData,
  //   fll: state.filteredListings.length,
  //   lldl: state.listingsOnDisplay.length,
  //   hasMore: state.listingsOnDisplay.length < state.filteredListings.length,
  // });

  return (
    <>
      <Row justify="space-between" align="middle">
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
          xxl: 4, // could even consider 5 for xxl
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
      <List
        grid={{
          xs: 1,
          sm: 1,
          md: 3,
          lg: 3,
          xl: 4,
          xxl: 4, // could even consider 5 for xxl
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

import React, { useContext, useEffect, useState, useReducer } from 'react';
import styled from 'styled-components';
import { drop } from 'ramda';
import sv from '@/constants/styles';
import StorePreview from '@/components/elements/StorePreview';
import FeaturedStoreSDK, { StorefrontFeature } from '@/modules/storefront/featured';
import { List, Space, Row, Col, Typography, RowProps, ListProps, Image } from 'antd';
import Button from '@/components/elements/Button';
import { WalletContext } from '@/modules/wallet';
import {
  Listing,
  ListingPreview,
  SkeletonListing,
} from '@/common/components/elements/ListingPreview';
import { FeaturedListingCarousel } from '@/common/components/elements/FeaturedListingsCarousel';
import {
  allDemoStorefronts,
  demoFeaturedListings,
  demoListings,
  generateListingShell,
} from '@/common/constants/demoContent';
import {
  DiscoveryRadioDropdown,
  ListingsSortAndFilter,
} from '@/common/components/elements/ListingsSortAndFilter';

const FEATURED_STOREFRONTS_URL = process.env.FEATURED_STOREFRONTS_URL as string;
const { Title } = Typography;

const ContentCol = styled(Col)`
  max-width: 1400px;
`;

const SectionTitle = styled(Title)`
  margin-bottom: 62px !important;
`;

const HeroTitle = styled.h1`
  font-weight: 800;
  font-size: 68px;
  line-height: auto;
  @media screen and (max-width: 550px) {
    font-size: 48px;
    line-height: auto;
    text-align: left;
  }
`;

const Marketing = styled(Col)`
  padding-right: 48px;
  padding-bottom: 48px;
  display: flex;
  flex-direction: column;
`;

const Pitch = styled.h2`
  font-size: 24px;
  line-height: 28px;
  letter-spacing: 0.2px;
  font-weight: 300;
  margin: 32px 0 40px 0;
  color: rgba(253, 253, 253, 0.6);
`;

const Section = styled(Row)`
  margin-top: ${sv.sectionPadding}px;
`;

const FeaturedStores = styled(List)<ListProps<StorefrontFeature>>`
  .ant-list-item {
    margin-bottom: 66px !important;
  }

  .ant-list-grid {
    .ant-col > .ant-list-item {
      margin-bottom: 66px;
    }
    .ant-card-meta-title {
      line-height: 20px;
    }
  }
`;

export async function getStaticProps() {
  const featuredStorefronts = await FeaturedStoreSDK.lookup(FEATURED_STOREFRONTS_URL);

  return {
    props: {
      featuredStorefronts,
    },
  };
}

interface HomeProps {
  featuredStorefronts: StorefrontFeature[];
}

export interface DiscoveryToolState {
  listings: Listing[];
  featuredListings: Listing[];
  listingsOnDisplay: Listing[];
  filter: FilterActions;
  sortBy: SortingActions;
}

type Action = {
  type: string;
  payload?: string | Listing[];
};

const sortingValues = [
  'SORT_BY_RECENT_BID',
  'SORT_BY_PRICE_HIGH_TO_LOW',
  'SORT_BY_PRICE_LOW_TO_HIGH',
  'SORT_BY_ENDING_SOONEST',
  'SORT_BY_RECENTLY_LISTED',
] as const;

type SortingActions = typeof sortingValues[number];
export type SortingOption = { value: SortingActions; label: string };
const sortingOptions: SortingOption[] = [
  { value: 'SORT_BY_RECENT_BID', label: 'Recent bids' },
  { value: 'SORT_BY_PRICE_HIGH_TO_LOW', label: 'Expensive' },
  { value: 'SORT_BY_PRICE_LOW_TO_HIGH', label: 'Cheap' },
  { value: 'SORT_BY_ENDING_SOONEST', label: 'Ending soonest' },
  { value: 'SORT_BY_RECENTLY_LISTED', label: 'Recent listings' },
];

// type SortingValues2 = typeof (sortingOptions.map(o => o.value))[number];
// const v: SortingValues2 = 'SORT_BY_PRICE_HIGH_TO_LOW'

const filterValues = [
  'FILTER_BY_SHOW_ALL',
  'FILTER_BY_ACTIVE_AUCTIONS',
  'FILTER_BY_BUY_NOW',
] as const;

type FilterActions = typeof filterValues[number];
export type FilterOption = { value: FilterActions; label: string };
const filterOptions: FilterOption[] = [
  { value: 'FILTER_BY_SHOW_ALL', label: 'Show all' },
  { value: 'FILTER_BY_ACTIVE_AUCTIONS', label: 'Active auctions' },
  { value: 'FILTER_BY_BUY_NOW', label: 'Buy now' },
];

export type DiscoveryToolAction =
  | {
      type: 'SET_LISTINGS';
      payload: Listing[];
    }
  | {
      type: 'SET_FEATURED_LISTINGS';
      payload: Listing[];
    }
  | {
      type: 'SET_STOREFRONTS';
      // payload
    }
  | {
      type: SortingActions;
    }
  | { type: FilterActions };

const initialState = (): DiscoveryToolState => {
  return {
    listings: Array(8)
      .fill(null)
      .map((_, i) => generateListingShell(i.toString())),
    featuredListings: Array(3)
      .fill(null)
      .map((_, i) => generateListingShell(i.toString())),
    listingsOnDisplay: Array(8)
      .fill(null)
      .map((_, i) => generateListingShell(i.toString())),
    filter: 'FILTER_BY_SHOW_ALL',
    sortBy: 'SORT_BY_PRICE_HIGH_TO_LOW',
  };
};

function reducer(state: DiscoveryToolState, action: DiscoveryToolAction) {
  switch (action.type) {
    case 'SET_LISTINGS':
      return {
        ...state,
        listings: action.payload,
        listingsOnDisplay: action.payload,
      };
    case 'SET_FEATURED_LISTINGS':
      return {
        ...state,
        featuredListings: action.payload,
      };
    case 'FILTER_BY_SHOW_ALL':
      return {
        ...state,
        filter: 'FILTER_BY_SHOW_ALL',
        listingsOnDisplay: state.listings,
      };
    case 'FILTER_BY_BUY_NOW':
      return {
        ...state,
        filter: 'FILTER_BY_BUY_NOW',
        listingsOnDisplay: state.listings.filter((l) => !l.ends_at),
      };
    case 'FILTER_BY_ACTIVE_AUCTIONS':
      return {
        ...state,
        filter: 'FILTER_BY_ACTIVE_AUCTIONS',
        listingsOnDisplay: state.listings.filter((l) => l.ends_at),
      };
    case 'SORT_BY_RECENTLY_LISTED':
      return {
        ...state,
        sortBy: 'SORT_BY_RECENTLY_LISTED',
        listingsOnDisplay: state.listings.sort((a, b) => a.created_at.localeCompare(b.created_at)),
      };
    case 'SORT_BY_RECENT_BID':
      return {
        ...state,
        sortBy: 'SORT_BY_RECENT_BID',
        listingsOnDisplay: state.listings.sort((a, b) => {
          if (!a.last_bid || !b.last_bid) return -1;
          return b.last_bid - a.last_bid;
        }),
      };
    case 'SORT_BY_ENDING_SOONEST':
      return {
        ...state,
        sortBy: 'SORT_BY_ENDING_SOONEST',
        listingsOnDisplay: state.listings.sort(
          (a, b) => a.ends_at?.localeCompare(b.ends_at || '') || -1
        ),
      };
    case 'SORT_BY_PRICE_HIGH_TO_LOW':
      return {
        ...state,
        sortBy: 'SORT_BY_PRICE_HIGH_TO_LOW',
        listingsOnDisplay: state.listings.sort((a, b) => {
          const aPrice = a.price_floor || a.instant_sale_price || 0;
          const bPrice = b.price_floor || b.instant_sale_price || 0;
          return aPrice - bPrice;
        }),
      };
    case 'SORT_BY_PRICE_LOW_TO_HIGH':
      return {
        ...state,
        sortBy: 'SORT_BY_PRICE_LOW_TO_HIGH',
        listingsOnDisplay: state.listings.sort((a, b) => {
          const aPrice = a.price_floor || a.instant_sale_price || 0;
          const bPrice = b.price_floor || b.instant_sale_price || 0;
          return bPrice - aPrice;
        }),
      };
    default:
      throw new Error('Not a valid action for state');
  }
}

export default function Home({ featuredStorefronts }: HomeProps) {
  const { connect } = useContext(WalletContext);

  // @ts-ignore
  const [state, dispatch] = useReducer(reducer, initialState());
  console.log(state);
  const heroStorefront = featuredStorefronts[0];

  // const [allListings, setAllListings] = useState<Listing[]>(Array(8).fill({}));
  // const [featuredListings, setFeaturedListings] = useState<Listing[]>(Array(4).fill({}));

  useEffect(() => {
    // hack to mock api loading speeds, making them extra slow for now to test loadings states
    new Promise<Listing[]>((resolve) =>
      setTimeout(() => resolve(demoFeaturedListings), 1500 + Math.random() * 5000)
    ).then((fls: Listing[]) => {
      // @ts-ignore
      dispatch({ type: 'SET_FEATURED_LISTINGS', payload: fls });
    });

    new Promise<Listing[]>((resolve) =>
      setTimeout(() => resolve(demoListings as any), 3000 + Math.random() * 10000)
    ).then((als) => {
      // @ts-ignore
      dispatch({ type: 'SET_LISTINGS', payload: als });
    });

    // TOOD: Add promise to simulate different call to fetch metadata for each nft and a stiching function to insert it into the listing
    // new Promise<ListingMeta[]>((resolve) =>
    //   setTimeout(() => resolve(meta), 3000 + Math.random() * 20000)
    // ).then((als) => {
    //   const listingsWithMeta = combineListingsWithMeta(als);
    //   setAllListings(listingsWithMeta);
    // });
  }, []);

  return (
    <Row justify="center">
      <ContentCol xs={22} md={20}>
        <Section>
          <Marketing xs={22} md={16}>
            <HeroTitle>Find, buy, and sell NFTs from incredible artists on Solana.</HeroTitle>
            <Pitch>
              Our mission is to empower creators and collectors by building a suite of integrated
              tools to mint, discover, and sell NFTs on Solana.
            </Pitch>
            <Space direction="horizontal" size="large">
              <Button size="large" onClick={() => connect()}>
                Create Your Store
              </Button>
            </Space>
          </Marketing>
          <Col xs={0} md={8}>
            <FeaturedListingCarousel featuredListings={state.featuredListings} />
          </Col>
        </Section>

        <SectionTitle level={3}>Featured stores</SectionTitle>
        <FeaturedStores
          grid={{ xs: 1, sm: 1, md: 2, lg: 4, xl: 4, xxl: 4, gutter: 16 }}
          dataSource={featuredStorefronts.slice(0, 4)}
          renderItem={(feature) => (
            // @ts-ignore
            <List.Item key={feature.storefront.subdomain}>
              {/* @ts-ignore */}
              <StorePreview {...feature} />
            </List.Item>
          )}
        />

        <Row justify="space-between" align="middle">
          <Title level={3}>Current listings</Title>
          {/* <ListingsSortAndFilter
            state={state}
            dispatch={dispatch}
            sortingOptions={sortingOptions}
            filterOptions={filterOptions}
          /> */}
          <Space direction="horizontal">
            <DiscoveryRadioDropdown
              label="Filter"
              value={state.filter}
              options={filterOptions}
              dispatch={dispatch}
            />
            <DiscoveryRadioDropdown
              label="Sort"
              value={state.sortBy}
              options={sortingOptions}
              dispatch={dispatch}
            />
          </Space>
        </Row>

        <List
          pagination={{
            // position: 'top',
            defaultCurrent: 1,
            showSizeChanger: false,
            style: {
              margin: '24px auto',
              textAlign: 'center',
            },
          }}
          grid={{
            xs: 2,
            sm: 2,
            md: 3,
            lg: 4,
            xl: 4,
            xxl: 5, // could even consider 5 for xxl
            gutter: 24,
          }}
          dataSource={state.listingsOnDisplay}
          renderItem={(listing, i) => (
            // @ts-ignore
            <List.Item key={listing?.address || i}>
              {/* @ts-ignore */}
              {!listing.subdomain ? <SkeletonListing /> : <ListingPreview {...listing} />}
            </List.Item>
          )}
        />

        <Section justify="center" align="middle">
          <Space direction="vertical" align="center">
            <Title level={3}>Launch your own Solana NFT store today!</Title>
            <Button size="large" onClick={() => connect()}>
              Create Your Store
            </Button>
          </Space>
        </Section>
      </ContentCol>
    </Row>
  );
}

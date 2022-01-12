import React, { useContext, useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import StorePreview from '@/components/elements/StorePreview';
import FeaturedStoreSDK, { StorefrontFeature } from '@/modules/storefront/featured';
import {
  PageHeader,
  List,
  Space,
  Row,
  Col,
  Typography,
  ListProps,
  Carousel,
  Select,
  SelectProps,
} from 'antd';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import {
  take,
  compose,
  when,
  add,
  always,
  ifElse,
  filter,
  concat,
  not,
  pipe,
  is,
  isNil,
  prop,
  descend,
  ascend,
  sortWith,
  equals,
  map,
  range,
} from 'ramda';
import Button from '@/components/elements/Button';
import { WalletContext } from '@/modules/wallet';
import { IndexerSDK, Listing } from '@/modules/indexer';
import {
  generateListingShell,
  ListingPreview,
  SkeletonListing,
} from '@/common/components/elements/ListingPreview';
import { SelectValue } from 'antd/lib/select';
import { TrackingAttributes, useAnalytics } from '@/modules/ganalytics/AnalyticsProvider';

const { Title, Text } = Typography;
const Option = Select.Option;

const FEATURED_STOREFRONTS_URL = process.env.FEATURED_STOREFRONTS_URL as string;
const WHICHDAO = process.env.NEXT_PUBLIC_WHICHDAO as string;
const DAO_LIST_IPFS = process.env.NEXT_PUBLIC_DAO_LIST_IPFS || "https://ipfs.cache.holaplex.com/bafkreidnqervhpcnszmjrj7l44mxh3tgd7pphh5c4jknmnagifsm62uel4";

const DAOStoreFrontList = async () => {
  if (WHICHDAO) {
    const response = await fetch(DAO_LIST_IPFS)
    const json = await response.json()
    console.log(
      'returning ' + json[WHICHDAO]
    )
    return json[WHICHDAO];
  }
    console.log(
      'returning nothing'
    )

  return []

}

const HeroTitle = styled.h1`
  font-weight: 600;
  font-size: calc(0.25vw + 0.25vh + 3rem);
  line-height: auto;
  @media screen and (max-width: 1250px) {
    font-size: calc(0.25vw + 0.25vh + 2.5rem);
  }
  @media screen and (max-width: 1150px) {
    font-size: calc(0.25vw + 0.25vh + 2.25rem);
  }
  @media screen and (max-width: 550px) {
    line-height: auto;
    text-align: left;
  }
`;

const Marketing = styled(Col)`
  padding-right: 5rem;
  display: flex;
  flex-direction: column;
  margin-bottom: calc(0.5vw + 0.5vh + 2rem);
  justify-content: center;
  @media screen and (max-width: 900px) {
    padding-right: 2.5rem;
  }
  @media screen and (max-width: 768px) {
    padding-right: 0;
  }
`;

const Pitch = styled.h2`
  font-size: calc(0.35vw + 0.35vh + 1rem);
  line-height: 1.4;
  letter-spacing: 0.2px;
  font-weight: 300;
  margin: calc(0.25vw + 0.25vh + 1rem) 0 calc(0.25vw + 0.25vh + 2rem);

  @media screen and (max-width: 900px) {
    font-size: calc(0.35vw + 0.35vh + 0.85rem);
  }
`;

const Section = styled(Row)`
  margin-top: calc(0.5vw + 0.5vh + 0.5rem);
`;

const StorefrontSection = styled(Section)`
  h3 {
    &.ant-typography {
      margin: 0 0 62px 0;
    }
  }
`;

const FeaturedStores = styled(List)<ListProps<StorefrontFeature>>`
  .ant-list-item {
    margin-bottom: 66px !important;

    .ant-card {
      border-radius: 8px !important;
    }
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

const CenteredContentCol = styled.div`
  margin: 0 auto;
  width: calc(1400px + 3rem);
  max-width: 100vw;
  padding: 0 3rem;

  @media screen and (max-width: 600px) {
    padding: 0 1.5rem;
  }
`;

const ListingsHeader = styled(PageHeader)`
  position: sticky;
  top: 0;
  z-index: 1;
  background: #161616f3;
  width: calc(100% + 60px);
  margin-left: -30px;
  padding: 12px 30px;
  backdrop-filter: blur(10px);
  h3 {
    &.ant-typography {
      margin: 0;
    }
  }
`;

interface SelectInlineProps extends SelectProps<SelectValue> {
  label: string;
}

const SelectInline = styled(Select)<SelectInlineProps>`
  width: 165px;
  font-size: 12px;
  line-height: 12px;
  .ant-select-selection-item {
    &:before {
      color: rgba(255, 255, 255, 0.6);
      content: '${({ label }) => label}:';
      display: block;
      font-size: 14px;
      color: grey;
      display: inline-block;
      padding: 0 12px 0 0;
    }
  }
`;

const HeroCarousel = styled(Carousel)`
  .carousel-dots {
    position: absolute;
    top: 0;
    right: 0;
    margin-top: -24px;
    margin-right: 0px;
    justify-content: flex-end;
  }

  .carousel-dots > li > button {
    opacity: 1;
    padding-top: 5px;
    padding-bottom: 5px;
    border-radius: 100%;
  }

  .slick-dots li {
    > button {
      display: block;
      width: 100%;
      color: transparent;
      font-size: 0;
      background: #222;
      border: 0;
      border-radius: 1px;
      outline: none;
      cursor: pointer;
      opacity: 1;
    }

    &.slick-active {
      > button {
        background: #f4f4f4;
        width: 24px;
      }
    }
  }
`;

const HeroCol = styled(Col)`
  .ant-typography {
    display: block;
    margin: 0 0 0.5rem 0;
  }
`;
export enum FilterOptions {
  All = 'all',
  Auctions = 'auctions',
  InstantSale = 'instant_sale',
}

export enum SortOptions {
  RecentlyAdded = 'recently_added',
  EndingSoonest = 'ending_soonest',
  Expensive = 'expensive',
  Cheapest = 'cheapest',
  BidCount = 'bid_count',
  Trending = 'trending',
}

const sortOptions: {
  [key in FilterOptions]: {
    label: string;
    key: SortOptions;
  }[];
} = {
  all: [
    {
      label: 'New',
      key: SortOptions.RecentlyAdded,
    },
    { key: SortOptions.Trending, label: 'Trending' },
    {
      label: 'High to low',
      key: SortOptions.Expensive,
    },
    {
      label: 'Low to high',
      key: SortOptions.Cheapest,
    },
  ],
  auctions: [
    { key: SortOptions.RecentlyAdded, label: 'New' },
    { key: SortOptions.Trending, label: 'Trending' },
    { key: SortOptions.Expensive, label: 'High to low' },
    { key: SortOptions.Cheapest, label: 'Low to high' },
    { key: SortOptions.EndingSoonest, label: 'Ending soon' },
  ],
  instant_sale: [
    { key: SortOptions.RecentlyAdded, label: 'New' },
    { key: SortOptions.Expensive, label: 'High to low' },
    { key: SortOptions.Cheapest, label: 'Low to high' },
  ],
};

// @ts-ignore
const isAuction = pipe(prop('endsAt'), is(String));

const currentListingPrice = ifElse(
  isAuction,
  ifElse(pipe(prop('totalUncancelledBids'), equals(0)), prop('priceFloor'), prop('highestBid')),
  prop('instantSalePrice')
);

const filters = {
  [FilterOptions.Auctions]: isAuction,
  [FilterOptions.InstantSale]: pipe(isAuction, not),
  [FilterOptions.All]: pipe(always(true)),
};

const sorts = {
  [SortOptions.EndingSoonest]: [ascend(prop('endsAt')), descend(currentListingPrice)],
  [SortOptions.RecentlyAdded]: [descend(prop('createdAt')), descend(currentListingPrice)],
  [SortOptions.Expensive]: [descend(prop('highestBid')), descend(currentListingPrice)],
  [SortOptions.Cheapest]: [ascend(currentListingPrice), ascend(prop('endsAt'))],
  [SortOptions.Trending]: [descend(prop('totalUncancelledBids')), ascend(prop('endsAt'))],
};

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

const getDefaultFilter = () => {
  if (WHICHDAO) {
    return FilterOptions.All
  }
  return FilterOptions.Auctions
}

export default function Home({ featuredStorefronts }: HomeProps) {
  const { connect } = useContext(WalletContext);
  const { track } = useAnalytics();
  const [show, setShow] = useState(16);
  const [loading, setLoading] = useState(true);
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [featuredListings, setFeaturedListings] = useState<Listing[]>(
    Array(5)
      .fill(null)
      .map((_, i) => generateListingShell(i))
  );
  const [displayedListings, setDisplayedListings] = useState<Listing[]>([]);
  const [filterBy, setFilterBy] = useState<FilterOptions>(getDefaultFilter());
  const [sortBy, setSortBy] = useState<SortOptions>(SortOptions.Trending);
  const listingsTopRef = useRef<HTMLInputElement>(null);

  const scrollToListingTop = () => {
    if (!listingsTopRef || !listingsTopRef.current) {
      return;
    }

    listingsTopRef.current.scrollIntoView();
  };

  const loadMoreListings = () => {
    const total = displayedListings.length;

    const next = compose(
      when((next) => next > total, always(total)),
      add(8)
    )(show);

    setShow(next);
  };

  const hasNextPage = show < displayedListings.length;

  const [sentryRef] = useInfiniteScroll({
    loading,
    hasNextPage,
    onLoadMore: loadMoreListings,
    rootMargin: '0px 0px 200px 0px',
  });

  const applyListingFilterAndSort = compose<Listing[], Listing[], Listing[]>(
    filter(filters[filterBy]),
    //@ts-ignore
    sortWith(sorts[sortBy])
  );

    

  // initial fetch and display
  useEffect(() => {
    async function getListings() {
      const allListings = await IndexerSDK.getListings();
      let daoFilteredListings = allListings;

      if (WHICHDAO) {
        const selectedDaoSubdomains = await DAOStoreFrontList();
        daoFilteredListings = daoFilteredListings.filter(listing => selectedDaoSubdomains.includes(listing.subdomain))
      }

      setAllListings(daoFilteredListings);
      setFeaturedListings(daoFilteredListings.slice(0, 5));
      setDisplayedListings(applyListingFilterAndSort(daoFilteredListings));

      setLoading(false);
    }

    getListings();
  }, []);

  // update display on new filter or sort
  useEffect(() => {
    if (loading) {
      return;
    }

    setDisplayedListings(applyListingFilterAndSort(allListings));
    setShow(16);
  }, [filterBy, sortBy]);

  return (
    <Row>
      <CenteredContentCol>
        <Section>
          <Marketing xs={22} md={16}>
            <HeroTitle>
              Discover, explore, and collect NFTs from incredible creators on Solana
            </HeroTitle>
            <Pitch>Tools built by creators, for creators, owned by creators.</Pitch>
            <Space direction="horizontal" size="large">
              <Button onClick={() => connect()}>Create Your Store</Button>
            </Space>
          </Marketing>
          <HeroCol xs={24} md={8}>
            <Text strong>Featured Listings</Text>
            <HeroCarousel autoplay={true} dots={{ className: 'carousel-dots' }} dotPosition="top">
              {featuredListings.map((listing, i) => (
                <ListingPreview
                  key={listing.listingAddress}
                  listing={listing}
                  meta={{
                    index: i,
                    list: 'featured-listings',
                    sortBy: sortBy,
                    filterBy: filterBy,
                  }}
                />
              ))}
            </HeroCarousel>
          </HeroCol>
        </Section>
        { !process.env.NEXT_PUBLIC_WHICHDAO && <StorefrontSection>
          <Col xs={24}>
            <Title level={3}>Featured Creators</Title>
            <FeaturedStores
              grid={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 4, xxl: 4, gutter: 24 }}
              dataSource={featuredStorefronts.slice(0, 4)}
              renderItem={(feature) => (
                // @ts-ignore
                <List.Item key={feature.storefront.subdomain}>
                  {/* @ts-ignore */}
                  <StorePreview {...feature} />
                </List.Item>
              )}
            />
          </Col>
        </StorefrontSection> }
        <Section>
          <Col xs={24}>
            <div ref={listingsTopRef} />
            <ListingsHeader
              ghost={false}
              title={<span>Current listings</span>}
              extra={[
                <Space key="options" direction="horizontal">
                  <SelectInline
                    dropdownClassName="select-inline-dropdown"
                    value={filterBy}
                    label="Filter"
                    onChange={(nextFilterBy) => {
                      const filter = nextFilterBy as FilterOptions;
                      track('Filter Update', {
                        event_category: 'Discovery',
                        event_label: filter,
                        from: filterBy,
                        to: filter,
                        sortBy,
                        nrOfListingsOnDisplay: displayedListings.length,
                      });
                      setFilterBy(filter);
                      // only reset sortBy if it does not work in the new filter
                      if (!sortOptions[filter].find((s) => s.key === sortBy)) {
                        setSortBy(sortOptions[filter][0].key);
                      }
                      scrollToListingTop();
                    }}
                  >
                    <Option value={FilterOptions.All}>All listings</Option>
                    <Option value={FilterOptions.Auctions}>Auctions</Option>
                    <Option value={FilterOptions.InstantSale}>Buy now</Option>
                  </SelectInline>
                  <SelectInline
                    label="Sort"
                    dropdownClassName="select-inline-dropdown"
                    value={sortBy}
                    onChange={(nextSortBy) => {
                      const sort = nextSortBy as SortOptions;
                      track('Sort Update', {
                        event_category: 'Discovery',
                        event_label: sort,
                        from: sortBy,
                        to: sort,
                        filterBy,
                        nrOfListingsOnDisplay: displayedListings.length,
                      });

                      setSortBy(sort);
                      scrollToListingTop();
                    }}
                  >
                    {sortOptions[filterBy].map(({ label, key }) => (
                      <Option key={key} value={key}>
                        {label}
                      </Option>
                    ))}
                  </SelectInline>
                </Space>,
              ]}
            />
            <Row gutter={24}>
              {take(show, displayedListings).map((listing: Listing, i) => (
                <Col xs={24} sm={12} md={8} lg={8} xl={6} xxl={6} key={listing?.listingAddress}>
                  <ListingPreview
                    listing={listing}
                    meta={{
                      index: i,
                      list: 'current-listings',
                      sortBy: sortBy,
                      filterBy: filterBy,
                    }}
                  />
                </Col>
              ))}
              {(hasNextPage || loading) && (
                <>
                  <Col ref={sentryRef} xs={24} sm={12} md={8} lg={8} xl={6} xxl={6} key="shell-0">
                    <SkeletonListing />
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={8} xl={6} xxl={6} key="shell-1">
                    <SkeletonListing />
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={8} xl={6} xxl={6} key="shell-2">
                    <SkeletonListing />
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={8} xl={6} xxl={6} key="shell-3">
                    <SkeletonListing />
                  </Col>
                </>
              )}
            </Row>
          </Col>
        </Section>
        <Section justify="center" align="middle">
          <Space direction="vertical" align="center">
            <Title level={3}>Launch your own Solana NFT store today!</Title>
            <Button onClick={() => connect()}>Create Your Store</Button>
          </Space>
        </Section>
      </CenteredContentCol>
    </Row>
  );
}

import React, { useContext, useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import StorePreview from '@/components/elements/StorePreview';
import FeaturedStoreSDK, { StorefrontFeature } from '@/modules/storefront/featured';
import { PageHeader, List, Space, Row, Col, Typography, ListProps, Carousel, Select, SelectProps } from 'antd';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { take, compose, when, add, always, ifElse, filter, identity, concat, not, pipe, isNil, prop, descend, ascend, sortWith, equals, map, range } from 'ramda';
import Button from '@/components/elements/Button';
import { WalletContext } from '@/modules/wallet';
import { IndexerSDK, Listing } from '@/modules/indexer';
import { ListingPreview, SkeletonListing } from '@/common/components/elements/ListingPreview';
import { SelectValue } from 'antd/lib/select';
const { Title, Text } = Typography;

const FEATURED_STOREFRONTS_URL = process.env.FEATURED_STOREFRONTS_URL as string;
const Option = Select.Option;

const HeroTitle = styled.h1`
  font-weight: 800;
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

const FeaturedStores = styled(List) <ListProps<StorefrontFeature>>`
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
  padding: 0 1.5rem;
`;

const ListingsHeader = styled(PageHeader)`
  position: sticky;
  top: 0;
  z-index: 1;
  background: #000;
  padding: 12px 0;
  h3 {
    &.ant-typography {
      margin: 0;
    }
  }
`;

interface SelectInlineProps extends SelectProps<SelectValue> {
  label: string;
}

const SelectInline = styled(Select) <SelectInlineProps>`
  width: 165px;
  font-size: 12px;
  line-height: 12px;
  .ant-select-selection-item {
    &:before {
      color: rgba(255, 255, 255, 0.6);
      content: "${({ label }) => label}:";
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
      opacity: .3;
  
    }

    &.slick-active {
      > button {
        background: white;
        width: 24px;
      }
    }
  }
`;

enum FilterOptions {
  All = 'all',
  Auctions = 'auctions',
  InstantSale = 'instant_sale'
};

enum SortOptions {
  RecentlyAdded = 'recently_added',
  EndingSoonest = 'ending_soonest',
  Expensive = 'expensive',
  Cheapest = 'cheapest',
  BidCount = 'bid_count'
}

const sortOptions = {
  all: [
    {
      label: 'New',
      key: SortOptions.RecentlyAdded,
    },
    {
      label: 'Hight to Low',
      key: SortOptions.Expensive,
    },
    {
      label: 'Low to Hight',
      key: SortOptions.Cheapest,
    },
  ],
  auctions: [
    { key: SortOptions.Expensive, label: 'Hight to Low' },
    { key: SortOptions.Cheapest, label: 'Low to High' },
    { key: SortOptions.EndingSoonest, label: 'Ending Soon' },
    { key: SortOptions.RecentlyAdded, label: 'New' },
    { key: SortOptions.BidCount, label: 'Bidders' },
  ],
  instant_sale: [
    { key: SortOptions.RecentlyAdded, label: 'New' },
    { key: SortOptions.Expensive, label: 'Hight to Low' },
    { key: SortOptions.Cheapest, label: 'Low to High' },
  ],
};

//@ts-ignore
const isAuction = pipe(prop('instantSalePrice'), isNil);

const currentListingPrice = ifElse(
  isAuction,
  ifElse(
    pipe(prop('totalUncancelledBids'), equals(0)),
    prop('priceFloor'),
    prop('highestBid'),
  ),
  prop('instantSalePrice'),
)

const filters = {
  [FilterOptions.Auctions]: isAuction,
  [FilterOptions.InstantSale]: pipe(isAuction, not),
  [FilterOptions.All]: pipe(always(true)),
}

const sorts = {
  [SortOptions.EndingSoonest]: [ascend(prop('endsAt')), descend(currentListingPrice)],
  [SortOptions.RecentlyAdded]: [descend(prop('createdAt')), descend(currentListingPrice)],
  [SortOptions.Expensive]: [descend(prop('highestBid')), descend(currentListingPrice)],
  [SortOptions.Cheapest]: [ascend(currentListingPrice), ascend(prop('endsAt'))],
  [SortOptions.BidCount]: [descend(prop('totalUncancelledBids'))]
}

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

export default function Home({ featuredStorefronts }: HomeProps) {
  const { connect } = useContext(WalletContext);
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<Listing[]>([]);
  const [seeing, setSeeListings] = useState<Listing[]>([]);
  const [show, setShow] = useState(16);
  const [filterBy, setFilterBy] = useState<FilterOptions>(FilterOptions.Auctions);
  const [sortBy, setSortBy] = useState<SortOptions>(SortOptions.Expensive);
  const [hasMoreListings, setHasMoreListings] = useState(true);
  const listingsTopRef = useRef<HTMLInputElement>(null);

  const scrollToListingTop = () => {
    if (!listingsTopRef || !listingsTopRef.current) {
      return;
    };

    listingsTopRef.current.scrollIntoView();
  };

  const loadMoreListings = () => {
    const total = seeing.length;

    const next = compose(
      when(next => next > seeing.length, always(seeing.length)),
      add(4),
    )(show);

    setShow(next);
    setHasMoreListings(total > next);
  }

  const [sentryRef] = useInfiniteScroll({
    loading,
    hasNextPage: hasMoreListings,
    onLoadMore: loadMoreListings,
  });

  useEffect(() => {
    async function getListings() {
      const listings = await IndexerSDK.getListings();

      setListings(listings);
      setSeeListings(
        //@ts-ignore
        compose(
          // @ts-ignore
          filter(filters[filterBy]),
          // @ts-ignore
          sortWith(sorts[sortBy])
          // @ts-ignore
        )(listings),
      );

      setLoading(false);
    }

    getListings();
  }, []);

  useEffect(() => {
    if (loading) {
      return;
    }

    setSeeListings(
      //@ts-ignore
      compose(
        // @ts-ignore
        filter(filters[filterBy]),
        // @ts-ignore
        sortWith(sorts[sortBy])
        // @ts-ignore
      )(listings),
    );
    setShow(8);
  }, [filterBy, sortBy]);

  return (
    <Row>
      <CenteredContentCol>
        <Section>
          <Marketing xs={22} md={16}>
            <HeroTitle>Discover, explore, and collect NFTs from incredible creators on Solana</HeroTitle>
            <Pitch>
              Tools built by creators, for creators, owned by creators.
            </Pitch>
            <Space direction="horizontal" size="large">
              <Button onClick={() => connect()}>
                Create Your Store
              </Button>
            </Space>
          </Marketing>
          <Col xs={24} md={8}>
            <Text strong>Featured Listings</Text>
            {loading ? (
              <SkeletonListing />
            ) : (
              <HeroCarousel autoplay={true} dots={{ className: 'carousel-dots' }} dotPosition="top">
                {listings.slice(0, 5).map((listing) => (
                  <ListingPreview key={listing.listingAddress} {...listing} />
                ))}
              </HeroCarousel>
            )}
          </Col>
        </Section>
        <StorefrontSection>
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
        </StorefrontSection>
        <Section>
          <Col xs={24}>
            <div ref={listingsTopRef} />
            <ListingsHeader
              ghost={false}
              title={<Title level={3}>Current Listings</Title>}
              extra={[
                <Space key="options" direction="horizontal">
                  <SelectInline
                    value={filterBy}
                    label="Filter"
                    onChange={(next) => {
                      const filter = next as FilterOptions;
                      setFilterBy(filter);
                      setSortBy(sortOptions[filter][0].key);
                      scrollToListingTop();
                    }}
                  >
                    <Option value={FilterOptions.All}>All Listings</Option>
                    <Option value={FilterOptions.Auctions}>Auctions</Option>
                    <Option value={FilterOptions.InstantSale}>Buy Now</Option>
                  </SelectInline>
                  <SelectInline
                    label="Sort"
                    value={sortBy}
                    onChange={(next) => {
                      const sort = next as SortOptions;

                      setSortBy(sort);
                      scrollToListingTop();
                    }}
                  >
                    {sortOptions[filterBy].map(({ label, key }) => {
                      return <Option key={key} value={key}>{label}</Option>
                    })}
                  </SelectInline>
                </Space>
              ]}
            />
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
              dataSource={take(show, seeing)}
              renderItem={(listing: Listing) => (
                <List.Item key={listing?.listingAddress}>
                  <ListingPreview {...listing} />
                </List.Item>
              )}
            />
            {hasMoreListings && (
              <Row ref={sentryRef} gutter={24}>
                <Col xs={24} sm={12} md={8} lg={8} xl={6} xxl={6}>
                  <SkeletonListing />
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={6} xxl={6}>
                  <SkeletonListing />
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={6} xxl={6}>
                  <SkeletonListing />
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={6} xxl={6}>
                  <SkeletonListing />
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={6} xxl={6}>
                  <SkeletonListing />
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={6} xxl={6}>
                  <SkeletonListing />
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={6} xxl={6}>
                  <SkeletonListing />
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={6} xxl={6}>
                  <SkeletonListing />
                </Col>
              </Row>
            )}
            
          </Col>
        </Section>
        <Section justify="center" align="middle">
          <Space direction="vertical" align="center">
            <Title level={3}>Launch your own Solana NFT store today!</Title>
            <Button onClick={() => connect()}>
              Create Your Store
            </Button>
          </Space>
        </Section>
      </CenteredContentCol>
    </Row>
  );
}

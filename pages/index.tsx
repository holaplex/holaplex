import React, { useContext } from 'react';
import styled from 'styled-components';
import { drop } from 'ramda';
import sv from '@/constants/styles';
import StorePreview from '@/components/elements/StorePreview';
import FeaturedStoreSDK, { StorefrontFeature } from '@/modules/storefront/featured';
import { List, Space, Row, Col, Typography, RowProps } from 'antd';
import Button from '@/components/elements/Button';
import { WalletContext } from '@/modules/wallet';
import { Listing, ListingPreview } from '@/common/components/elements/ListingPreview';
import { Storefront } from '@/modules/storefront/types';
import { FeaturedListingCarousel } from '@/common/components/elements/FeaturedListingsCarousel';

const FEATURED_STOREFRONTS_URL = process.env.FEATURED_STOREFRONTS_URL as string;
const { Title } = Typography;

const ContentCol = styled(Col)`
  max-width: 1400px;
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

const FeaturedStores = styled(Section)<RowProps>`
  .ant-list-grid {
    .ant-col > .ant-list-item {
      margin-bottom: 66px;
    }
    .ant-card-meta-title {
      line-height: 20px;
    }
  }
  .ant-typography {
    margin: 0 0 62px 0;
  }
`;

const StyledSection = FeaturedStores;

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

const F = {
  name: 'arweave file',
  type: 'f',
  url: '',
};

const storefronts: { [subdomain: string]: Storefront } = {
  kristianeboe: {
    theme: {
      banner: F,
      primaryColor: '#FFF',
      backgroundColor: '#000',
      textFont: 'Lato',
      titleFont: 'Lato',
      logo: F,
    },
    meta: {
      title: 'Non fungible 🍪s',
      description: 'hehehe',
      favicon: F,
    },
    subdomain: 'kristianeboe',
    pubkey: 'NnXxp3aUTbD3bxWnXSR95zsiav54XDAWkespqJP1obh',
  },
};

const listings: Listing[] = [
  {
    auctionId: 'aaaa',
    title: 'White 🦈',
    previewImageURL:
      'https://images.unsplash.com/photo-1620206343767-7da98185edd4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1867&q=80',
    createdAt: new Date(2021, 9, 1).getTime(),
    storefront: storefronts['kristianeboe'],
  },
  {
    auctionId: 'aaab',
    title: 'Yggdrasil',
    auctionEndTime: new Date(2021, 10, 24, 23).getTime(),
    previewImageURL:
      'https://images.unsplash.com/photo-1635601036415-16b9a77b70a2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80',
    createdAt: new Date(2021, 10, 2).getTime(),
    storefront: storefronts['kristianeboe'],
  },
  {
    loading: true,
    auctionId: 'aaac',
    title: 'Blank',
    previewImageURL: '',
    createdAt: new Date(2021, 8, 3).getTime(),
  },
  {
    auctionId: 'baaa',
    title: 'NFT 1',
    previewImageURL:
      'https://images.unsplash.com/photo-1637008336770-b95d637fd5fa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1528&q=80',
    auctionEndTime: new Date(2021, 10, 24, 19).getTime(),
    createdAt: new Date(2021, 9, 1).getTime(),
    storefront: storefronts['kristianeboe'],
  },

  {
    loading: true,
    auctionId: 'baac',
    title: 'Blank',
    previewImageURL: '',
    createdAt: new Date(2021, 8, 3).getTime(),
  },
  {
    auctionId: 'baaafalc',
    title: 'Millennium Falcon',
    previewImageURL:
      'https://images.unsplash.com/photo-1587336735677-0f2a3efdcc5d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1712&q=80',
    auctionEndTime: new Date(2021, 10, 22, 19).getTime(),
    createdAt: new Date(2021, 9, 1).getTime(),
    storefront: storefronts['kristianeboe'],
  },

  {
    loading: true,
    auctionId: 'baac',
    title: 'Blank',
    previewImageURL: '',
    createdAt: new Date(2021, 8, 3).getTime(),
  },
];

const featuredListings = listings.filter((l) => l.previewImageURL).slice(0, 4);
const remainingListings = listings.slice(4);

export default function Home({ featuredStorefronts }: HomeProps) {
  const { connect } = useContext(WalletContext);

  const heroStorefront = featuredStorefronts[0];

  return (
    <Row justify="center">
      <ContentCol xs={22} md={20}>
        <Section justify="start">
          <Marketing xs={24} md={16}>
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
          {heroStorefront && (
            <Col xs={0} md={8}>
              {/* <StorePreview {...heroStorefront} /> */}

              <FeaturedListingCarousel featuredListings={featuredListings} />
            </Col>
          )}
        </Section>

        <StyledSection>
          <Col>
            <Title level={3}>Current listings</Title>
            <List
              grid={{
                xs: 1,
                sm: 2,
                md: 3,
                lg: 3,
                xl: 4,
                xxl: 4, // could even consider 5 for xxl
                gutter: 24,
              }}
              dataSource={listings.concat(listings)}
              renderItem={(feature) => (
                <List.Item key={feature.auctionId}>
                  <ListingPreview {...feature} />
                </List.Item>
              )}
            />
          </Col>
        </StyledSection>

        <StyledSection justify="center">
          <Col>
            <Title level={3}>Featured Creators</Title>
            <List
              grid={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 3, gutter: 16 }}
              dataSource={drop<StorefrontFeature>(1, featuredStorefronts)}
              renderItem={(feature) => (
                <List.Item key={feature.storefront.subdomain}>
                  <StorePreview {...feature} />
                </List.Item>
              )}
            />
          </Col>
        </StyledSection>
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

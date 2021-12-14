import React, { useContext, useEffect, useState, useReducer } from 'react';
import styled from 'styled-components';
import sv from '@/constants/styles';
import StorePreview from '@/components/elements/StorePreview';
import FeaturedStoreSDK, { StorefrontFeature } from '@/modules/storefront/featured';
import { List, Space, Row, Col, Typography, ListProps } from 'antd';
import Button from '@/components/elements/Button';
import { WalletContext } from '@/modules/wallet';
import { generateListingShell, Listing } from '@/common/components/elements/ListingPreview';
import { FeaturedListingCarousel } from '@/common/components/elements/FeaturedListingsCarousel';
import { DiscoveryRadioDropdown } from '@/common/components/elements/ListingsSortAndFilter';
import { callMetaplexIndexerRPC } from '@/modules/utils/callMetaplexIndexerRPC';
import { useRouter } from 'next/router';
import { CurrentListings } from '@/common/components/elements/CurrentListings';
const { Title } = Typography;

const FEATURED_STOREFRONTS_URL = process.env.FEATURED_STOREFRONTS_URL as string;

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
`;

const Section = styled(Row)`
  margin-top: ${sv.sectionPadding}px;
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

  const [featuredListings, setFeaturedListings] = useState<Listing[]>([]);

  useEffect(() => {
    async function getFeaturedListings() {
      const featuredListings = await callMetaplexIndexerRPC('getFeaturedListings');
      setFeaturedListings(featuredListings);
    }

    getFeaturedListings();
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
            <FeaturedListingCarousel featuredListings={featuredListings} />
          </Col>
        </Section>

        <SectionTitle level={3}>Featured stores</SectionTitle>
        <FeaturedStores
          grid={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 4, xxl: 4, gutter: 24 }}
          dataSource={featuredStorefronts.slice(0, 4)}
          renderItem={(feature) => (
            // @ts-ignore
            <List.Item key={feature.storefront.subdomain}>
              {/* @ts-ignore */}
              <StorePreview {...feature} />
            </List.Item>
          )}
        />

        <CurrentListings />
      </ContentCol>
      {/* CTA */}
      <Section justify="center" align="middle">
        <Space direction="vertical" align="center">
          <Title level={3}>Launch your own Solana NFT store today!</Title>
          <Button size="large" onClick={() => connect()}>
            Create Your Store
          </Button>
        </Space>
      </Section>
    </Row>
  );
}

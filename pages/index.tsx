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
import { callMetaplexIndexerRPC } from '@/modules/utils/callMetaplexIndexerRPC';
import { useRouter } from 'next/router';
import {
  CurrentListings,
  filterAndSortListings,
} from '@/common/components/elements/CurrentListings';
const { Title } = Typography;
import useWindowDimensions from '@/hooks/useWindowDimensions';

const FEATURED_STOREFRONTS_URL = process.env.FEATURED_STOREFRONTS_URL as string;

const SectionTitle = styled(Title)`
  margin-bottom: 62px !important;
`;

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
  padding: 0 1.5rem;
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

  const [featuredListings, setFeaturedListings] = useState<Listing[]>(
    Array(4)
      .fill(null)
      .map((_, i) => generateListingShell(i + ''))
  );
  const [allListings, setAllListings] = useState<Listing[]>(
    Array(4)
      .fill(null)
      .map((_, i) => generateListingShell(i + ''))
  );

  const windowDimensions = useWindowDimensions();

  const buttonSize = () => (windowDimensions.width > 1000 ? 'large' : 'medium');

  useEffect(() => {
    // async function getFeaturedListings() {
    //   const featuredListings = await callMetaplexIndexerRPC('getFeaturedListings');
    //   setFeaturedListings(featuredListings);
    // }

    // getFeaturedListings();
    async function getListings() {
      const allListings = await callMetaplexIndexerRPC('getListings');
      // dispatch({ type: 'INITIALIZE_LISTINGS', payload: allListings });

      // loadMoreData();
      const trendingListings = filterAndSortListings(allListings, [], 'MOST_BIDS');
      const featuredListings = trendingListings.slice(0, 4);

      setFeaturedListings(featuredListings);
      const currentListings = trendingListings; // spliced above
      setAllListings(currentListings);
    }
    getListings();
  }, []);

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
              <Button size={buttonSize()} onClick={() => connect()}>
                Create Your Store
              </Button>
            </Space>
          </Marketing>
          <Col xs={24} md={8}>
            <div style={{ marginBottom: '-2rem' }}>
              <FeaturedListingCarousel featuredListings={featuredListings} />
            </div>
          </Col>
        </Section>

        <SectionTitle level={3}>Featured Stores</SectionTitle>
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

        <CurrentListings allListings={allListings} />
        {/* CTA */}
        <Section justify="center" align="middle">
          <Space direction="vertical" align="center">
            <Title level={3}>Launch your own Solana NFT store today!</Title>
            <Button size={buttonSize()} onClick={() => connect()}>
              Create Your Store
            </Button>
          </Space>
        </Section>
      </CenteredContentCol>
    </Row>
  );
}

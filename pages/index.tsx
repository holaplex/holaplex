import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { drop } from 'ramda';
import sv from '@/constants/styles';
import StorePreview from '@/components/elements/StorePreview';
import FeaturedStoreSDK, { StorefrontFeature } from '@/modules/storefront/featured';
import { List, Space, Row, Col, Typography, RowProps, ListProps } from 'antd';
import Button from '@/components/elements/Button';
import { WalletContext } from '@/modules/wallet';
import { Listing, ListingPreview } from '@/common/components/elements/ListingPreview';
import { FeaturedListingCarousel } from '@/common/components/elements/FeaturedListingsCarousel';
import { allDemoStorefronts, demoListings, demoStorefronts } from '@/common/constants/demoContent';

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

export default function Home({ featuredStorefronts }: HomeProps) {
  const { connect } = useContext(WalletContext);

  const heroStorefront = featuredStorefronts[0];

  const [allListings, setAllListings] = useState<Listing[]>(Array(8).fill({}));
  const [featuredListings, setFeaturedListings] = useState<Listing[]>(Array(4).fill({}));

  function combineListingsWithStorefronts(listingArray: Listing[]): Listing[] {
    return listingArray.map((l) => ({
      ...l,
      demoStoreFront: allDemoStorefronts[l.storefrontSubdomain],
    }));
  }
  useEffect(() => {
    // hack to mock api loading speeds, making them extra slow for now to test loadings states
    new Promise<Listing[]>((resolve) =>
      setTimeout(
        () =>
          resolve([
            {
              auctionId: 'aaaa',
              title: 'White 🦈',
              previewImageURL:
                'https://images.unsplash.com/photo-1620206343767-7da98185edd4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1867&q=80',
              createdAt: '2021-09-30T22:00:00.000Z',
              storefrontSubdomain: 'kristianeboe',
              ownerAddress: 'kristianeboe',
            },
            {
              auctionId: 'aaab',
              title: 'Yggdrasil',
              auctionEndTime: '2021-10-26T21:00:00.000Z',
              previewImageURL:
                'https://images.unsplash.com/photo-1635601036415-16b9a77b70a2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80',
              createdAt: '2021-09-30T22:00:00.000Z',
              storefrontSubdomain: 'kristianeboe',
              ownerAddress: 'kristianeboe',
            },
          ]),
        1500 + Math.random() * 10000
      )
    ).then((fls: Listing[]) => {
      const listingsWithStorefronts = combineListingsWithStorefronts(fls);
      setFeaturedListings(listingsWithStorefronts);
    });

    new Promise<Listing[]>((resolve) =>
      setTimeout(() => resolve(demoListings as any), 3000 + Math.random() * 20000)
    ).then((als) => {
      const listingsWithStorefronts = combineListingsWithStorefronts(als);
      setAllListings(listingsWithStorefronts);
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
            <FeaturedListingCarousel featuredListings={featuredListings} />
          </Col>
        </Section>

        <SectionTitle level={3}>Featured stores</SectionTitle>
        <FeaturedStores
          grid={{ xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 4, gutter: 16 }}
          dataSource={featuredStorefronts.slice(0, 3)}
          renderItem={(feature) => (
            // @ts-ignore
            <List.Item key={feature.storefront.subdomain}>
              {/* @ts-ignore */}
              <StorePreview {...feature} />
            </List.Item>
          )}
        />

        <SectionTitle level={3}>Current listings</SectionTitle>
        <List
          grid={{
            xs: 2,
            sm: 2,
            md: 3,
            lg: 4,
            xl: 4,
            xxl: 5, // could even consider 5 for xxl
            gutter: 24,
          }}
          dataSource={allListings}
          renderItem={(feature) => (
            <List.Item key={feature.auctionId}>
              <ListingPreview {...feature} />
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

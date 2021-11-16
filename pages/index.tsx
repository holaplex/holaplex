import React, { useContext } from 'react'
import styled from 'styled-components'
import { drop } from 'ramda'
import sv from '@/constants/styles'
import StorePreview from '@/components/elements/StorePreview';
import FeaturedStoreSDK, { StorefrontFeature } from '@/modules/storefront/featured';
import { List, Space, Row, Col, Typography, RowProps } from 'antd'
import Button from '@/components/elements/Button'
import { WalletContext } from '@/modules/wallet'

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
  justify-content: center;
`;

const Pitch = styled.h2`
  font-size: 24px;
  line-height: 28px;
  letter-spacing: 0.2px;
  font-weight: 300;
  margin: 32px 0 40px 0;
  color: rgba(253, 253, 253, 0.6);
`

const Section = styled(Row)`
  margin-top: ${sv.sectionPadding}px;
`;

const FeaturedStores = styled(Section) <RowProps>`
  .ant-list-grid {
    .ant-col > .ant-list-item {
      margin-bottom: 66px;
    }
  }
  .ant-typography {
    margin: 0 0 62px 0;
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

  return (
    <Row justify="center">
      <ContentCol xs={22} md={20}>
        <Section justify="center">
          <Marketing xs={24} md={16}>
            <HeroTitle>Find, buy, and sell NFTs from incredible artists on Solana.</HeroTitle>
            <Pitch>Our mission is to empower creators and collectors by building a suite of integrated tools to mint, discover, and sell NFTs on Solana.</Pitch>
            <Space direction="horizontal" size="large">
              <Button size="large" onClick={() => connect()}>Create Your Store</Button>
            </Space>
          </Marketing>
          {heroStorefront && (
            <Col xs={0} md={8}>
              <StorePreview
                {...heroStorefront}
              />
            </Col>
          )}
        </Section>
        <FeaturedStores justify="center">
          <Col>
            <Title level={3}>Featured Creators</Title>
            <List
              grid={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 3, gutter: 16 }}
              dataSource={drop<StorefrontFeature>(1, featuredStorefronts)}
              renderItem={(feature) => (
                <List.Item key={feature.storefront.subdomain}>
                  <StorePreview
                    {...feature}
                  />
                </List.Item>
              )}
            />

          </Col>
        </FeaturedStores>
        <Section justify="center" align="middle">
          <Space direction="vertical" align="center">
            <Title level={3}>Launch your own Solana NFT store today!</Title>
            <Button size="large" onClick={() => connect()}>Create Your Store</Button>
          </Space>
        </Section>
      </ContentCol>
    </Row>
  )
}

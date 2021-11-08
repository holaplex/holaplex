import React, { useContext } from 'react'
import styled from 'styled-components'
import sv from '@/constants/styles'
import higlightStores from '@/assets/highlight-stores/highlight-stores-stub'
import FeaturedStore from '@/components/elements/FeaturedStore'
import { List, Space, Row, Col, Typography } from 'antd'
import Button from '@/components/elements/Button'
import { WalletContext } from '@/modules/wallet'

const { Title, Text, Paragraph } = Typography;

const HeroTitle = styled.h1`
  font-weight: 800;
  font-size: 48px;
  line-height: 48px;
  color: #fff;
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

export default function Home() {
  const { connect } = useContext(WalletContext);

  const heroStorefront = higlightStores[0];

  return (
    <>
      <Section justify="center">
        <Col xs={22} md={20} lg={18} xl={16}>
          <Row>
            <Marketing xs={24} md={16}>
              <HeroTitle>Find, buy, and sell NFTs from incredible artists.</HeroTitle>
              <Pitch>Our mission is to empower creators and collectors by building a suite of integrated tools to mint, discover, and sell NFTs.</Pitch>
              <Space direction="horizontal" size="large">
                <Button size="large" onClick={() => connect()}>Create Your Store</Button>
              </Space>
            </Marketing>
            <Col xs={0} md={8}>
              <a
                href={heroStorefront.url}
                target="_blank"
                rel="noreferrer"
              >
                <FeaturedStore
                  name={heroStorefront.name}
                  image={heroStorefront.imagePath}
                  twitter={heroStorefront.twitter}
                />
              </a>
            </Col>
          </Row>
        </Col>
      </Section>

      <Section justify="center">
        <Col xs={22} md={20} lg={18} xl={16}>
          <Title level={3}>Featured creators</Title>
          <List
            grid={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4, gutter: 16 }}
            dataSource={higlightStores.slice(1)}
            renderItem={(store: { url: string, imagePath: string, name: string }) => (
              <List.Item key={store.url}>
                <a
                  href={store.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FeaturedStore
                    name={store.name}
                    image={store.imagePath}
                  />
                </a>
              </List.Item>
            )}
          />

        </Col>
      </Section>

      <Section justify="center" align="middle">
        <Space direction="vertical" align="center">
          <Title level={3}>Launch your own NFT store today!</Title>
          <Button size="large" onClick={() => connect()}>Create Your Store</Button>
        </Space>
      </Section>
    </>
  )
}

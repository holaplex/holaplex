import React, { useContext } from 'react'
import styled from 'styled-components'
import sv from '@/constants/styles'
import SocialLinks from '@/components/elements/SocialLinks'
import higlightStores from '@/assets/highlight-stores/highlight-stores-stub'
import FeaturedStore from '@/components/elements/FeaturedStore'
import { List, Space, Row, Col, Typography, Card } from 'antd'
import Button from '@/components/elements/Button'
import { WalletContext } from '@/modules/wallet'

const { Title } = Typography;

const HeroTitle = styled.h1`
  font-weight: 800;
  font-size: 48px;
  line-height: 48px;
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

const FinalCall = styled(Row)`
  margin: 0 0 100px 0;
`

const Footer = styled(Row)`
  padding: 280px 0 60px 0;
`;


export default function Home() {
  const { connect } = useContext(WalletContext)

  return (
    <>
      <Section justify="center" align="middle">
        <Col xs={22} sm={22} md={22} lg={22} xl={18} xxl={16}>
          <Row>
            <Marketing xs={24} md={16}>
              <HeroTitle>Empowering a community of thousands of creators. </HeroTitle>
              <Pitch>We’re building a suite of no-code required tools to enable creators and collectors to mint, discover, and sell NFTs.</Pitch>
              <Space direction="horizontal" size="large">
                <Button size="large" onClick={() => connect()}>Create your Store</Button>
              </Space>
            </Marketing>
            <Col xs={0} md={8}>
              <FeaturedStore
                name={higlightStores[0].name}
                image={higlightStores[0].imagePath}
              />
            </Col>
          </Row>
        </Col>
      </Section>
      <Section justify="center">
        <Col xs={22} sm={22} md={22} lg={22} xl={18} xxl={16}>
          <Title level={5}>Featured creators</Title>
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

      <Footer justify="center">
        <Col span={23}>
          <FinalCall justify="center" align="middle">
            <Space direction="vertical" align="center">
              <Title level={3}>Launch your own NFT store today!</Title>
              <Button size="large" onClick={() => connect()}>Create Your Store</Button>
            </Space>
          </FinalCall>
          <Row>
            <Col md={8}>
              <a href="mailto:hola@holaplex.com">hola@holaplex.com</a>

            </Col>
            <Col md={8}
            >
              <Row justify="center">
                Made with &#10084; on &#160;<a href="https://www.metaplex.com" target="_blank" rel="noreferrer">Metaplex</a>
              </Row>
            </Col>
            <Col md={8}
            >
              <Row justify="end">
                <SocialLinks />
              </Row>
            </Col>
          </Row>
        </Col>
      </Footer>
    </>
  )
}

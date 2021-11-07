import React, { useContext } from 'react'
import Image from 'next/image'
import styled from 'styled-components'
import sv from '@/constants/styles'
import SocialLinks from '@/components/elements/SocialLinks'
import RoadmapImage from '@/assets/images/roadmap-v1.svg'
import InvestorsData from '@/assets/investors/investors-stub'
import { List, Space, Row, Col, Typography, Card } from 'antd'
import Button from '@/components/elements/Button'
const { Title, Text, Paragraph } = Typography;

const Container = styled.div``;
const Roadmap = styled.div`
  margin: 70px 0 0 0;
  width: 100%;
  overflow-x: auto;
  padding: 0 ${sv.appPadding}px;
`;

const HeroTitle = styled.h1`
  text-align: center;
  font-weight: 800;
  font-size: 68px;
  line-height: auto;
  color: #fff;
  margin-top: ${sv.sectionPadding}px;
  @media screen and (max-width: 550px) {
    margin-top: ${sv.appPadding}px;
    font-size: 48px;
    line-height: auto;
    text-align: left;
    padding: 0 ${sv.appPadding}px;
  }
`;

const Pitch = styled.h2`
  font-size: 24px;
  line-height: 32px;
  letter-spacing: 0.2px;
  text-align: center;
  font-weight: 300;
  color: rgba(253, 253, 253, 0.6);
  @media screen and (max-width: 550px) {
    font-size: 20px;
    text-align: left;
    padding: 0 ${sv.appPadding}px;
  }
`


const LightText = styled(Paragraph)`
  color: rgba(255,255,255,.6);
  a {
    color: rgba(255,255,255,1);
    text-decoration: underline;
    &:hover {
      color: rgba(255,255,255,.6);
      text-decoration: underline;
    }
  }
`;

const LightTitle = styled(Title)`
  &.ant-typography, &.ant-typography {
    color: #ffffff;
  }
`;

const Community = styled(Row)`
  margin-top: ${sv.sectionPadding*2}px;
  @media screen and (max-width: 550px) {
    margin-top: ${sv.sectionPadding}px;
    padding: 0 ${sv.appPadding}px;
  }
`;

const Stats = styled.div``;

const Stat = styled(Col)`
  text-align: center;
  padding: ${sv.grid}px;
`;

type StatTitleProps = {
  textColor: string;
}
const StatTitle = styled.h1`
  background: ${({ textColor }: StatTitleProps) => textColor};
  font-size: 5vw;
  margin-bottom: 0;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  @media screen and (min-width: 1600px) {
    font-size: 90px;
  }
  @media screen and (max-width: 768px) {
    font-size: 48px;
  }
`;

const WhiteButton = styled(Button)`
  background: white;
  color: ${sv.colors.cta};
  &:hover {
    background: white;
    color: ${sv.colors.ctaHover};
  }
`;

const CenterdCol = styled(Col)`
  max-width: 1400px;
`;

const BackedBy = styled(Row)`
  margin-top: ${sv.sectionPadding*2}px;
`;

const Investors = styled.div`
  width: 100%;
  background: #fff;
  border-radius: 8px;
  margin-top: ${sv.appPadding}px;
`;

const Investor = styled.div`
  margin: ${sv.grid*4}px;
  position: relative;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LogoContainer = styled.a`
  width: 100%;
  height: 100%;
  max-width: 120px;
  display: block;
  position: relative;
`;

const Footer = styled(Row)`
  margin: 112px 0 0 0;
  padding: 280px 0 60px 0;
  color: rgba(253, 253, 253, 0.6);
  a {
    color: rgba(253, 253, 253, 0.6);
    &:hover {
      color: rgba(253, 253, 253, 1);
    }
  }
`;

const CenteredTitle = styled(LightTitle)`
  text-align: center;
`;


export default function About() {
  return (
    <Container>
      <Row justify="center">
        <CenterdCol sm={16} md={14} lg={12} xl={14}>
          <Space direction="vertical" align="center" size="large">
            <HeroTitle>Empowering a community of thousands of creators. </HeroTitle>
            <Pitch>We’re building a suite of no-code required tools to enable creators and collectors to mint, discover, and sell NFTs.</Pitch>
          </Space>
        </CenterdCol>
      </Row>

      <Row justify="center">
        <Col>
          <Roadmap>
            <Image layout="fixed" width={1147} height={185} src={RoadmapImage} alt="hola" />
          </Roadmap>
        </Col>
      </Row>

      <Community justify="center">
        <CenterdCol sm={20} md={18} lg={16} xl={16}>
          <Row>
            <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
              <LightTitle level={2}>We exist for our community of creators.</LightTitle>
              <LightText>The rapid rise of NFTs has allowed creators to build communities and monetize their work in  innovative ways. So much talent has come into this space but there are barriers preventing some from joining. Using the tools needed to mint and sell NFTs is non-trivial even for experienced developers.</LightText>
              <LightText>Holaplex is committed to building tools that will allow creators and collectors to join the NFT community easily and safely.</LightText>
            </Col>
            <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
              <Stats>
                <Row>
                  <Stat span={12}>
                    <StatTitle textColor={sv.colors.mainGradient}>1k+</StatTitle>
                    <LightText>Stores created</LightText>
                  </Stat>
                  <Stat span={12}>
                    <StatTitle textColor={sv.colors.orangeGradient}>5k+</StatTitle>
                    <LightText>NFTs minted</LightText>
                  </Stat>
                </Row>
                <Row>
                  <Stat span={12}>
                    <StatTitle textColor={sv.colors.orangeGradient}>6k+</StatTitle>
                    <LightText>Twitter followers</LightText>
                  </Stat>
                  <Stat span={12}>
                    <StatTitle textColor={sv.colors.greenGradient}>1m+</StatTitle>
                    <LightText>USD transaction volume</LightText>
                  </Stat>
                </Row>
              </Stats>
            </Col>
          </Row>
        </CenterdCol>
      </Community>

      <BackedBy justify="center">
        <CenterdCol sm={20} md={18} lg={16} xl={16}>
          <CenteredTitle level={2}>Backed by</CenteredTitle>
          <Investors>
            <List
              grid={{ xs: 2, sm: 3, md: 4, lg: 4, xl: 4, xxl: 4, gutter: 16 }}
              dataSource={InvestorsData}
              renderItem={(investor: { url: string, logo: string, name: string }) => (
                <List.Item key={investor.url}>
                  <Investor>
                    <LogoContainer
                      href={investor.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Image layout="fill" objectFit="contain" src={investor.logo} alt={investor.name} />
                    </LogoContainer>
                  </Investor>
                </List.Item>
              )}
            />
          </Investors>
        </CenterdCol>
      </BackedBy>


      <Footer justify="center">
        <Col xs={18}>
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
    </Container>
  )
}

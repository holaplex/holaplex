import React, { useContext } from 'react'
import styled from 'styled-components'
import sv from '@/constants/styles'
import RoadmapImage from '@/assets/images/roadmap-v1.svg'
import investorData from '@/assets/investors/investors-stub';
import { List, Space, Row, Col, Typography, Image, ListProps } from 'antd'

const { Title, Text, Paragraph } = Typography;

const Roadmap = styled(Image)`
  margin: 70px 0 0 0;
`;

const HeroTitle = styled.h1`
  text-align: center;
  font-weight: 800;
  line-height: auto;
  color: #fff;
  font-size: 48px;
  @media screen and (min-width: 800px) {
    font-size: 68px;
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

const Community = styled(Row)`
  margin: 124px 0 84px 0;
`;

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

const Investors = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  .ant-col {
    > .ant-list-item {
      text-align: center;
      display: flex;
      align-items: center;
      flex-direction: column;
      margin: 0 0 22px 0;
    }
  }
`;


export default function About() {
  return (
    <Row justify="center" align="middle">
      <Col xs={22} sm={22} md={20} xl={18} xxl={16}>
        <Space direction="vertical" align="center" size="large">
          <HeroTitle>Empowering a community of thousands of creators. </HeroTitle>
          <Pitch>We’re building a suite of no-code required tools to enable creators and collectors to mint, discover, and sell NFTs.</Pitch>
        </Space>

        <Roadmap preview={false} width="100%" src={RoadmapImage} alt="holaplex roadmap" />

        <Community>
          <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
            <Title level={2}>We exist for our community of creators.</Title>
            <LightText>The rapid rise of NFTs has allowed creators to build communities and monetize their work in  innovative ways. So much talent has come into this space but there are barriers preventing some from joining. Using the tools needed to mint and sell NFTs is non-trivial even for experienced developers.</LightText>
            <LightText>Holaplex is committed to building tools that will allow creators and collectors to join the NFT community easily and safely.</LightText>
          </Col>
          <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
            <Row>
              <Stat span={12}>
                <StatTitle textColor={sv.colors.mainGradient}>1.5k+</StatTitle>
                <LightText>Stores created</LightText>
              </Stat>
              <Stat span={12}>
                <StatTitle textColor={sv.colors.orangeGradient}>5k+</StatTitle>
                <LightText>NFTs minted</LightText>
              </Stat>
            </Row>
            <Row>
              <Stat span={12}>
                <StatTitle textColor={sv.colors.orangeGradient}>8k+</StatTitle>
                <LightText>Twitter followers</LightText>
              </Stat>
              <Stat span={12}>
                <StatTitle textColor={sv.colors.greenGradient}>40k+</StatTitle>
                <LightText>SOL transaction volume</LightText>
              </Stat>
            </Row>
          </Col>
        </Community>

        <Title level={2} >Backed by</Title>
        <Investors>
          <List
            grid={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4, gutter: 28 }}
            dataSource={investorData}
            renderItem={(investor) => (
              <List.Item key={investor.url}>
                <a
                  href={investor.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image preview={false} src={investor.logo} alt={investor.name} />
                </a>
              </List.Item>
            )}
          />
        </Investors>
      </Col>
    </Row>
  )
}

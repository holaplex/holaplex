import React, { useContext } from 'react'
import Image from 'next/image'
import styled from 'styled-components'
import sv from '@/constants/styles'
import WavesSection from '@/assets/images/wave-section.svg'
import Tester from '../public/demo-logo.png'
import HighlightStores from '@/assets/highlight-stores/highlight-stores-stub'
import HandLogo from '@/assets/images/hola-logo.svg'
import { Space, Row, Col, Typography, Card } from 'antd'
import Button from '@/components/elements/Button'
import { WalletContext } from '@/modules/wallet'

const {Title, Text} = Typography;

const Logo = styled.div`
  margin: 70px 0 0 0;
`;

const HeroTitle = styled.h1`
  text-align: center;
  font-weight: 800;
  font-size: 68px;
  line-height: 68px;
  color: #fff;
`;

const LightText = styled(Text)`
  color: rgba(255,255,255,.6);
`;

const LightTitle = styled(Title)`
  color: #ffffff !important;
`;

const Pitch = styled.h2`
  font-size: 32px;
  line-height: 38px;
  letter-spacing: 0.2px;
  text-align: center;
  font-weight: 300;
  color: rgba(253, 253, 253, 0.6);
`

const VideoSection = styled(Row)`
  background-image: url('${WavesSection}');
  margin-top: ${sv.sectionPadding}px;
  padding: ${sv.sectionPadding*2.5}px 0;
`;

const Video = styled.div`
  border-radius: ${sv.grid}px;
  overflow: hidden;
  position: relative;
  padding: 0 0 56.25% 0;
  min-height: 100px;
  box-shadow: 0 0 8px rgba(0,0,0,.2);
  .video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }
`;

const VideoPitch = styled.div`
  height: 100%;
  ${sv.flexColumn};
  justify-content: center;
`;

const Community = styled(Row)`
  margin-top: ${sv.sectionPadding}px;
`;

const ComTitle = styled(LightTitle)`
  text-align: center;
`;

const Stores = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: ${sv.grid*2}px;
  width: 100%;
`;

const StoreItem = styled(Card)`
  width: 100%;
  overflow: hidden;
  margin-bottom: ${sv.grid*2}px;
  .ant-card-body {
    padding: 0;
  }
`;

const StoreImage = styled.div`
  width: 100%;
  height: 212px;
  background: aqua;
  background-image: url('${props => props.image}');
`;

const StoreName = styled.div`
  color: ${sv.colors.text};
`;


export default function Home() {
  console.log(WavesSection)
  const { solana, arweaveWallet, connect } = useContext(WalletContext)
  return (
    <>
      <Row justify="center">
        <Col sm={16} md={14} lg={12} xl={10}>
          <Space direction="vertical" align="center" size="large">
            <Logo>
              <Image width={90} height={90} src={HandLogo} />
            </Logo>
            <HeroTitle>Holaplex</HeroTitle>
            <Pitch>Design, launch, and host your Metaplex NFT marketplace. No coding required!</Pitch>
            {solana && arweaveWallet && (
              <Space direction="horizontal" size="large">
                <Button type="primary" size="large" onClick={() => connect()}>Create / Edit Your Store</Button>
              </Space>
            )}
          </Space>
        </Col>
      </Row>

      <VideoSection justify="center">
        <Col sm={20} md={18} lg={16} xl={16}>
          <Row gutter={24}>
            <Col span={12}>
              <VideoPitch direction="vertical">
                <LightTitle level={2}>Build your store in about 5 minutes</LightTitle>
                <LightText>Let’s be honest, nobody wants to spend weeks building a store. That’s why our team got together to create Holaplex - the no-code NFT store builder. Create a store in a couple of clicks so you can start selling!</LightText>
              </VideoPitch>
            </Col>
            <Col span={12}>
              <Video>
                <iframe className="video" src="https://www.youtube.com/embed/3AEqDfN-lX8" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
              </Video>
            </Col>
          </Row>
        </Col>
      </VideoSection>

      <Community justify="center">
        <Col sm={20} md={18} lg={16} xl={16}>
          <ComTitle level={2}>Join our community, 129 stores and counting!</ComTitle>

          <Stores>
            {HighlightStores.map((store, index) => {
              console.log(store)
              return (
                <StoreItem>
                  {/* <img src="../public/demo-logo.png" /> */}
                  <img src={store.image} />
                  <StoreImage image={store.image} />
                  <StoreName>{store.name}</StoreName>
                </StoreItem>
              )
            })}
          </Stores>

        </Col>
      </Community>
    </>
  )
}

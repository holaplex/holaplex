import React, { useContext } from 'react'
import Image from 'next/image'
import styled from 'styled-components'
import sv from '@/constants/styles'
import SocialLinks from '@/components/SocialLinks'
import WavesSection from '@/assets/images/wave-section.svg'
import WavesFooter from '@/assets/images/wave-footer.svg'
import HighlightStores from '@/assets/highlight-stores/highlight-stores-stub'
import HandLogo from '@/assets/images/hola-logo.svg'
import { Space, Row, Col, Typography, Card } from 'antd'
import Button from '@/components/elements/Button'
import { WalletContext } from '@/modules/wallet'
import useWindowDimensions from '@/hooks/useWindowDimensions'

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
  color: #ffffff !important;
`;

const WhiteButton = styled(Button)`
  background: white;
  color: ${sv.colors.cta};
  &:hover {
    background: white;
    color: ${sv.colors.ctaHover};
  }
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
  padding: ${sv.sectionPadding*2.5}px ${sv.appPadding}px;
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

type StoresProps = {
  storesPerRow: number;
}

const Stores = styled.div`
  display: grid;
  grid-template-columns: repeat(${({ storesPerRow }: StoresProps) => storesPerRow}, 1fr);
  grid-column-gap: ${sv.grid*2}px;
  width: 100%;
  padding: ${sv.appPadding}px;
`;

const StoreItem = styled(Card)`
  width: 100%;
  overflow: hidden;
  margin-bottom: ${sv.grid*2}px;
  cursor: pointer;
  transition: all .2s ease-out;
  .ant-card-body {
    padding: 0;
  }
  &:hover {
    transform: translate(0px, -4px);
    box-shadow: 0 0 8px rgba(0,0,0,.5);
  }
`;

type StoreImageProps = {
  image: string;
}

const StoreImage = styled.div<StoreImageProps>`
  width: 100%;
  height: 212px;
  background-image: url('${({image}: StoreImageProps) => image}');
  background-size: cover;
  background-position: center;
`;

const StoreName = styled.div`
  color: ${sv.colors.text};
  text-align: center;
  padding: ${sv.grid*2}px ${sv.grid}px;
`;

const Footer = styled(Row)`
  background-image: url('${WavesFooter}');
  margin-top: ${sv.sectionPadding}px;
  padding-top: ${sv.sectionPadding*2.5}px;
`;

const CenteredTitle = styled(LightTitle)`
  text-align: center;
`;

const FooterLinks = styled(Col)`
  height: 80px;
  ${sv.flexRow};
  margin-top: ${sv.sectionPadding}px;
`;

const FooterSection = styled.div`
  flex: 1;
  color: rgba(253, 253, 253, 0.6);
  a {
    color: rgba(253, 253, 253, 0.6);
    &:hover {
      color: rgba(253, 253, 253, 1);
    }
  }
`;

export default function Home() {
  const { solana, arweaveWallet, connect } = useContext(WalletContext)
  const windowDimensions = useWindowDimensions();
  let storesPerRow = 4
  if (windowDimensions.width < 400) {
    storesPerRow = 1
  } else if (windowDimensions.width < 880) {
    storesPerRow = 2
  }
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
            <Col span={windowDimensions.width > 860 ? 12 : 24}>
              <VideoPitch>
                <LightTitle level={2}>Build your store in about 5 minutes</LightTitle>
                <LightText>Let’s be honest, nobody wants to spend weeks building a store. That’s why our team got together to create Holaplex - the no-code NFT store builder. Create a store in a couple of clicks so you can start selling! Need some guidance?  Try our <a href="https://docs.google.com/document/d/1fggieMGqgJqfp-TDoSsoeqS38iKPKcb1tTfxBkPXbeM/edit#" target="_blank">getting started guide.</a></LightText>
              </VideoPitch>
              {windowDimensions.width < 860 &&
                <WhiteButton size="large" onClick={() => connect()}>Watch a Video</WhiteButton>
              }
            </Col>
            {windowDimensions.width > 860 &&
              <Col span={12}>
                <Video>
                  <iframe className="video" src="https://www.youtube.com/embed/3AEqDfN-lX8" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                </Video>
              </Col>
            }
          </Row>
        </Col>
      </VideoSection>

      <Community justify="center">
        <Col sm={20} md={20} lg={20} xl={18}>
          <CenteredTitle level={2}>Join our community, 129 stores and counting!</CenteredTitle>

          <Stores storesPerRow={storesPerRow}>
            {HighlightStores.map((store, index) => (
              <a
                key={index}
                href={store.url}
                target="_blank"
              >
                <StoreItem>
                  <StoreImage image={store.imagePath} />
                  <StoreName>{store.name}</StoreName>
                </StoreItem>
              </a>
            ))}
          </Stores>

        </Col>
      </Community>

      <Footer justify="center">
        <Space direction="vertical" align="center">
          <CenteredTitle level={3}>Launch your own NFT store today!</CenteredTitle>
          {solana && arweaveWallet && (
            <Space direction="horizontal" size="large">
              <WhiteButton size="large" onClick={() => connect()}>Create Your Store</WhiteButton>
            </Space>
          )}
        </Space>
        <FooterLinks span={22}>
          <FooterSection style={{textAlign: 'left'}}><a href="mailto:hola@holaplex.com">hola@holaplex.com</a></FooterSection>
          {windowDimensions.width > 800 &&
            <FooterSection style={{textAlign: 'center'}}>Made with 🤍 on <a href="https://www.metaplex.com" target="_blank">Metaplex</a></FooterSection>
          }
          <FooterSection style={{textAlign: 'right'}}>
            <SocialLinks />
          </FooterSection>
        </FooterLinks>
      </Footer>
    </>
  )
}

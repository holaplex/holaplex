import React from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import Head from 'next/head';
import { Typography, Button } from 'antd';
import Footer from '@/common/components/home/Footer';
import investorData from '@/assets/investors/investors-stub';
import Link from 'next/link';

const { Title, Paragraph } = Typography;

const GradientText = styled(Title)`
  font-size: 60px !important;
  font-size: clamp(24px, 4vw, 60px) !important;

  background: linear-gradient(to right, #ffffff 0%, #808080 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -o-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const BoldParagraph = styled.p`
  font-size: 24px;
  font-size: clamp(16px, 2vw, 24px);
  font-weight: bold;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  padding: 2rem 0;
  position: relative;

  &.slanted-bg {
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -25%;
      width: 150%;
      height: 100%;
      background: linear-gradient(to right, #000000, #202021);
      transform: rotate(7deg);
      pointer-events: none;
    }
  }
`;

const SlantedBgContainer = styled.div`
  width: 100%;
  overflow: hidden;
  padding: 10vw 0;
  margin: -10vw 0;
  position: relative;
  z-index: 2;
`;

const Content = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: auto;
  box-sizing: border-box;
  padding: 1rem;
  position: relative;
  z-index: 10;
`;

const HeroSection = styled(Section)`
  padding: 14rem 0;
  @media (max-width: 1000px) {
    padding: 4rem 0;
  }
  align-items: center;
  position: relative;
  min-height: calc(100vh - 80px);
  @media (max-width: 768px) {
    min-height: calc(100vh - 72px);
  }
`;

const LogoContainer = styled.a`
  width: 100%;
  height: 100%;
  max-width: 150px;
  aspect-ratio: 16 / 7;
  display: block;
  position: relative;
`;

const MainTool = styled.div`
  text-align: center;
  width: 100%;
  max-width: 12rem;
  & > div {
    margin: 0.75rem auto;
  }
`;

const CommunityNFTContainer = styled.div`
  width: 30%;
  margin-left: -3.5%;
  margin-right: -3.5%;
  border-radius: 4%;
  overflow: hidden;

  box-shadow: 0px 0px 4rem 0px rgba(255, 255, 255, 0.25);
  aspect-ratio: 1/1;

  &:nth-child(even) {
    margin-top: -25%;
  }
  &:last-child {
    margin-top: -15%;
  }
`;

export default function About() {
  return (
    <>
      <Head>
        <title>We exist for our community of creators | Holaplex</title>
        <meta
          property="description"
          key="description"
          content="Our mission is to empower creators and collectors with a suite of tools to create, market, and sell NFTs."
        />
      </Head>
      <HeroSection>
        <Image
          src={'/images/page-about/hero.jpg'}
          objectFit="cover"
          layout="fill"
          quality={100}
          alt=""
        />
        <div className="relative inset-y-10 right-0 ml-auto h-64 w-10/12 lg:absolute lg:h-auto lg:w-5/12 ">
          <Image
            src={'/images/page-about/laptop.png'}
            alt="Marketplace preview"
            layout={'fill'}
            objectFit={'contain'}
            objectPosition={'center right'}
          />
        </div>
        <Content>
          <div className="mt-12 lg:mt-0 lg:w-9/12">
            <BoldParagraph className="mb-4 text-gray-400 lg:mb-14">POWERED BY Solana</BoldParagraph>
            <GradientText>
              Incredibly Fast, <br className="hidden lg:block" />
              Low Cost &amp; Eco-Friendly.
            </GradientText>
            <BoldParagraph className="color-white mt-4 lg:mt-14">
              Tools that are open source, owned by creators, are <br className="hidden lg:block" />{' '}
              permissionless, and governed by the community.
            </BoldParagraph>
          </div>
        </Content>
      </HeroSection>

      <Section className="bg-gray-800">
        <Image src={'/images/page-about/connect.jpg'} alt="" objectFit="cover" layout="fill" />
        <Content className="text-center">
          <div className="py-8">
            <Title className="mt-0">Connect Your Wallet</Title>
            <Link href="/alpha">
              <a>
                <Button>Claim Your Profile</Button>
              </a>
            </Link>
          </div>
        </Content>
      </Section>

      <Section className="bg-black">
        <Content className="text-center">
          <BoldParagraph className="mb-8 text-gray-400 lg:mb-14">Our partners</BoldParagraph>
          <GradientText>
            Supported &amp; Trusted By <br className="hidden lg:block" /> The Best
          </GradientText>
          <BoldParagraph className="my-8 text-gray-500 lg:my-14">
            We work with leading funds and platforms
          </BoldParagraph>
          <div className="my-14 flex flex-wrap justify-center gap-4 lg:my-28 lg:gap-8">
            {investorData.map((investor, index) => (
              <LogoContainer
                key={investor.url}
                href={investor.url}
                target="_blank"
                rel="noreferrer"
              >
                <Image
                  layout="fill"
                  objectFit="contain"
                  src={investor.logoLight || investor.logo}
                  alt={investor.name}
                />
              </LogoContainer>
            ))}
          </div>
        </Content>
      </Section>

      <Section className="bg-black">
        <Content>
          <div className="mb-12 lg:mb-0 lg:w-3/4">
            <BoldParagraph className="mb-8 text-gray-400 lg:mb-14">WHAT WE CREATE</BoldParagraph>
            <GradientText>
              Three Main Tools of <br className="hidden lg:block" /> the Platform
            </GradientText>
            <BoldParagraph className="color-white mt-8 lg:mt-14">
              With Holaplex, it&apos;s easier than ever to get started in the NFT community.
              We&apos;re committed to making it easy for everyone to join.
            </BoldParagraph>
          </div>
          <div className="flex flex-wrap items-center justify-around gap-8 lg:hidden">
            <MainTool>
              <b>No-Code Tools</b>
              <div>
                <Image src={'/images/page-about/main-tool.svg'} width="94" height="94" />
              </div>
              <p>Profiles and Marketplaces</p>
            </MainTool>
            <MainTool className="lg:mt-16">
              <b>Social Graph</b>
              <div>
                <Image src={'/images/page-about/main-tool.svg'} width="94" height="94" />
              </div>
              <p>Solana&apos;s NFT Social Network supports following and feed</p>
            </MainTool>
            <MainTool className="lg:-mt-24 xl:-mt-32">
              <b>Indexer</b>
              <div>
                <Image src={'/images/page-about/main-tool.svg'} width="94" height="94" />
              </div>
              <p>Read Sonlana&apos;s on-chain NFT related data fast and efficiently</p>
            </MainTool>
          </div>
        </Content>
        <div
          className="pointer-events-none hidden w-full overflow-hidden lg:block"
          style={{ marginTop: 'clamp(-500px, -12%, 0px)' }}
        >
          <div
            className="max-w-8xl flex justify-center"
            style={{ width: '120%', marginLeft: '-12%' }}
          >
            <Image
              src={'/images/page-about/three-main-tools.svg'}
              width="2994"
              height="1417"
              className="w-full"
              alt="Three main tools"
            />
          </div>
        </div>
      </Section>

      <Section className="bg-black">
        <div
          className="mx-auto flex w-full flex-col items-center justify-center lg:flex-row"
          style={{ maxWidth: '1400px' }}
        >
          <div className="w-full lg:w-1/2">
            <Content>
              <BoldParagraph className="mb-8 text-gray-500 lg:mb-14">YOUR COMMUNITY</BoldParagraph>
              <GradientText>
                Build your following, <br className="hidden lg:block" /> own your audience
              </GradientText>
              <BoldParagraph className="mt-8 text-gray-400 lg:mt-14">
                Every follower is stored on-chain. This means they are portable to any platorm that
                utlizes the free and open-sourced Holaplex Social Graph. Build your following today!
              </BoldParagraph>
            </Content>
          </div>
          <div className="w-full max-w-md lg:w-1/2 lg:max-w-full">
            <Image src={'/images/page-about/audience.svg'} width="931" height="818" />
          </div>
        </div>
      </Section>

      <div className="bg-black py-14 lg:py-28">
        <SlantedBgContainer>
          <Section className="slanted-bg">
            <div
              className="mx-auto flex w-full flex-col items-center justify-center lg:flex-row lg:gap-12"
              style={{ maxWidth: '1400px' }}
            >
              <div className="w-11/12 max-w-lg lg:w-1/2">
                <Image
                  src={'/images/page-about/we-unlock-your-talent.png'}
                  width="1332"
                  height="1538"
                  alt="We unlock your talent"
                />
              </div>
              <div className="w-full lg:w-1/2">
                <Content>
                  <BoldParagraph className="mb-6 text-gray-400 lg:mb-14">YOUR TALENT</BoldParagraph>
                  <GradientText>
                    We Unlock Your <br className="hidden lg:block" /> extraordinary Work
                  </GradientText>
                  <BoldParagraph className="color-white mt-6 lg:mt-14">
                    Our mission is to empower creators and collectors with a suite of tools to
                    create, market, and sell NFTs.
                  </BoldParagraph>
                </Content>
              </div>
            </div>
          </Section>
        </SlantedBgContainer>
      </div>

      <Section className="bg-black">
        <Content className="text-center">
          <BoldParagraph className="mb-8 text-gray-400 lg:mb-14">YOUR COMMUNITY</BoldParagraph>
          <GradientText>A community driven by you</GradientText>
          <BoldParagraph className="color-white mx-auto mt-8 max-w-2xl lg:mt-14">
            You created it and you own it. Our community believes in being radically open,
            decentralized and permissionless.
          </BoldParagraph>
        </Content>
        <div className="mx-auto w-10/12 max-w-6xl">
          <div className="mt-24 flex flex-wrap items-center justify-around lg:mt-48">
            <CommunityNFTContainer className="">
              <Image src={'/images/page-about/nft-1.jpg'} width="500" height="500" alt="" />
            </CommunityNFTContainer>
            <CommunityNFTContainer className="z-20">
              <Image src={'/images/page-about/nft-2.jpg'} width="500" height="500" alt="" />
            </CommunityNFTContainer>
            <CommunityNFTContainer className="z-10">
              <Image src={'/images/page-about/nft-3.jpg'} width="500" height="500" alt="" />
            </CommunityNFTContainer>
            <CommunityNFTContainer className="">
              <Image src={'/images/page-about/nft-4.jpg'} width="500" height="500" alt="" />
            </CommunityNFTContainer>
          </div>
        </div>
      </Section>

      {/*
        <Section>
          <Content className='text-center'>
            <GradientText>
              GitHub Projects
            </GradientText>
            <BoldParagraph className='mt-14 color-gray-400'>
              Open-source tools increase velocity of innovation so we can win together. Come build with us!
            </BoldParagraph>
          </Content>
        </Section>
        */}

      <div className="-mb-20 h-20 bg-black" />
      <Footer />
    </>
  );
}

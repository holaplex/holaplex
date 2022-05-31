import React from 'react';
import Image from 'next/image';
import styled, { keyframes } from 'styled-components';
import Head from 'next/head';
import { Typography } from 'antd';
import Footer from '@/common/components/home/Footer';
import investorData from '@/assets/investors/investors-stub';
import Link from 'next/link';

const Heading = styled.h2`
  font-size: 32px;
  font-size: clamp(24px, 4vw, 32px);
  font-family: 'Inter', sans-serif;
`;
const SubHeading = styled.h3`
  font-size: 24px;
  font-size: clamp(20px, 3vw, 24px);
  font-family: 'Inter', sans-serif;
`;
const Paragraph = styled.p`
  font-size: 16px;
  color: #a8a8a8;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  padding: 3rem 0;
  @media (min-width: 1200px) {
    padding: 4.5rem 0;
  }
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
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

const CoreProduct = styled.div`
  text-align: center;
  width: 100%;
  max-width: 24rem;
  box-shadow: 0px 20px 32px rgba(0, 0, 0, 0.4);
  padding: 1rem;
  border-radius: 1rem;
  & > div {
    margin: 0.75rem auto;
  }
`;

const floating = keyframes`
  0% { transform: translate(0,  0%); }
  50% { transform: translate(0, 1%); }
  100% { transform: translate(0, -0%); }
`;

const CommunityNFTContainer = styled.div`
  width: 30%;
  margin-left: -3.5%;
  margin-right: -3.5%;
  border-radius: 4%;
  overflow: hidden;

  box-shadow: 0px 8px 10px 0px rgba(0, 0, 0, 0.25);
  aspect-ratio: 1/1;

  animation-name: ${floating};
  animation-duration: 5s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;

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
      <div className="container  mx-auto px-6 md:px-12">
        <Head>
          <title>About Holaplex | Holaplex</title>
          <meta
            property="description"
            key="description"
            content="Our mission is to empower creators and collectors with a suite of tools to create, market, and sell NFTs."
          />
          <body />
        </Head>

        <Section>
          <Content className="text-center">
            <Heading>A community driven by you</Heading>
            <Paragraph>
              You created it and you own it. Our community believes in being radically open,
              decentralized and permissionless.
            </Paragraph>
          </Content>
          <div className="mx-auto w-10/12 max-w-6xl">
            <div className="mt-24 flex flex-wrap items-center justify-around lg:mt-48">
              <CommunityNFTContainer
                style={{ animationDelay: '250ms ', animationDuration: '5s' }}
                className=""
              >
                <Image src={'/images/page-about/nft-1.jpg'} width="500" height="500" alt="" />
              </CommunityNFTContainer>
              <CommunityNFTContainer
                style={{ animationDelay: '500ms ', animationDuration: '6s' }}
                className="z-20"
              >
                <Image src={'/images/page-about/nft-2.jpg'} width="500" height="500" alt="" />
              </CommunityNFTContainer>
              <CommunityNFTContainer
                style={{ animationDelay: '1500ms', animationDuration: '5s' }}
                className="z-10"
              >
                <Image src={'/images/page-about/nft-3.jpg'} width="500" height="500" alt="" />
              </CommunityNFTContainer>
              <CommunityNFTContainer
                style={{ animationDelay: '2000ms', animationDuration: '6s' }}
                className=""
              >
                <Image src={'/images/page-about/nft-4.jpg'} width="500" height="500" alt="" />
              </CommunityNFTContainer>
            </div>
          </div>
        </Section>

        <Section>
          <div
            className="mx-auto flex w-full flex-col items-center justify-center lg:flex-row"
            style={{ maxWidth: '1400px' }}
          >
            <div className="w-full lg:w-1/2">
              <Content>
                <Heading>
                  Build your following, <br className="hidden lg:block" /> own your audience
                </Heading>
                <Paragraph>
                  Every follower is stored on-chain. This means they are portable to any platorm
                  that utlizes the free and open-sourced Holaplex Social Graph. Build your following
                  today!
                </Paragraph>
              </Content>
            </div>
            <div className="w-full max-w-md lg:w-1/2 lg:max-w-full">
              <Image src={'/images/page-about/audience.svg'} width="579" height="336" alt="" />
            </div>
          </div>
        </Section>

        <Section>
          <div
            className="mx-auto flex w-full flex-col items-center justify-center lg:flex-row lg:gap-12"
            style={{ maxWidth: '1400px' }}
          >
            <div className="w-11/12 max-w-lg lg:w-1/2">
              <Image
                src={'/images/page-about/we-unlock-your-talent.png'}
                width="594"
                height="826"
                alt="We unlock your talent"
              />
            </div>
            <div className="w-full lg:w-1/2">
              <Content>
                <Heading>
                  We Unlock Your <br className="hidden lg:block" /> extraordinary Work
                </Heading>
                <Paragraph>
                  Our mission is to empower creators and collectors with a suite of tools to create,
                  market, and sell NFTs.
                </Paragraph>
              </Content>
            </div>
          </div>
        </Section>

        <Section>
          <Content className="text-center">
            <div>
              <Heading>Our core products</Heading>
              <Paragraph>
                It’s easier than ever to get started with NFTs. With Holaplex, everyone’s welcome.
              </Paragraph>
            </div>
            <div className="flex w-full flex-wrap justify-around gap-8 lg:mt-12 lg:justify-between lg:gap-12">
              <CoreProduct>
                <div>
                  <Image
                    src={'/images/page-about/core-profiles.svg'}
                    width="48"
                    height="48"
                    alt=""
                  />
                </div>
                <SubHeading>Profiles</SubHeading>
                <Paragraph>
                  Every Solana wallet is a profile that operates as an NFT store
                </Paragraph>
              </CoreProduct>
              <CoreProduct>
                <div>
                  <Image src={'/images/page-about/core-alpha.svg'} width="48" height="48" alt="" />
                </div>
                <SubHeading>Alpha</SubHeading>
                <Paragraph>
                  An on-chain social feed of activity from profiles you’re following
                </Paragraph>
              </CoreProduct>
              <div className="flex w-full justify-center">
                <CoreProduct>
                  <div>
                    <Image
                      src={'/images/page-about/core-indexer.svg'}
                      width="48"
                      height="48"
                      alt=""
                    />
                  </div>
                  <SubHeading>Indexer</SubHeading>
                  <Paragraph>Better access to useful on-chain data at lightning speed</Paragraph>
                </CoreProduct>
              </div>
              <CoreProduct>
                <div>
                  <Image src={'/images/page-about/core-social.svg'} width="48" height="48" alt="" />
                </div>
                <SubHeading>Social Graph</SubHeading>
                <Paragraph>
                  An graph program that powers on-chain followers and social feeds
                </Paragraph>
              </CoreProduct>
              <CoreProduct>
                <div>
                  <Image
                    src={'/images/page-about/core-marketplace.svg'}
                    width="48"
                    height="48"
                    alt=""
                  />
                </div>
                <SubHeading>Marketplaces</SubHeading>
                <Paragraph>No-code NFT marketplaces for DAOs and NFT collectives</Paragraph>
              </CoreProduct>
            </div>
          </Content>
        </Section>

        <Section>
          <Content className="text-center">
            <Heading>Backed by</Heading>
            <br />
            <div className="flex flex-wrap justify-center gap-4 lg:gap-8">
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
          <br />
          <br />
          <br />
          <br />
          <Content className="text-center">
            <Heading>Our partners</Heading>
            <br />
            <div className="flex flex-wrap justify-center gap-4 lg:gap-8">
              <LogoContainer href="https://www.metaplex.com/" target="_blank" rel="noreferrer">
                <Image
                  layout="fill"
                  objectFit="contain"
                  src="/images/page-about/partners/metaplex.png"
                  alt="metaplex"
                />
              </LogoContainer>
              <LogoContainer href="https://www.cardinal.so/" target="_blank" rel="noreferrer">
                <Image
                  layout="fill"
                  objectFit="contain"
                  src="/images/page-about/partners/cardinal.png"
                  alt="cardinal"
                />
              </LogoContainer>
              <LogoContainer href="https://www.dialect.to/" target="_blank" rel="noreferrer">
                <Image
                  layout="fill"
                  objectFit="contain"
                  src="/images/page-about/partners/dialect.png"
                  alt="dialect"
                />
              </LogoContainer>
              <LogoContainer href="https://www.crossmint.io/" target="_blank" rel="noreferrer">
                <Image
                  layout="fill"
                  objectFit="contain"
                  src="/images/page-about/partners/crossmint.png"
                  alt="crossmint"
                />
              </LogoContainer>
              <LogoContainer href="https://www.notifi.network/" target="_blank" rel="noreferrer">
                <Image
                  layout="fill"
                  objectFit="contain"
                  src="/images/page-about/partners/notifi.png"
                  alt="notifi"
                />
              </LogoContainer>
            </div>
          </Content>
        </Section>
        <div className="-mt-20" />
      </div>
      <Footer />
    </>
  );
}

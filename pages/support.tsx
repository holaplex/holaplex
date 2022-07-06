import React from 'react';
import styled from 'styled-components';
import Head from 'next/head';
import Footer from 'src/views/home/Footer';
import Image from 'next/image';

const Heading = styled.h2`
  font-size: 60px;
  font-size: clamp(24px, 7vw, 60px);
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  text-transform: capitalize;

  background: linear-gradient(90deg, #ffffff 0%, rgba(128, 128, 128, 1) 61.72%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
`;
const HeadingSmall = styled.h3`
  font-size: 40px;
  font-size: clamp(24px, 5vw, 40px);
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  text-transform: capitalize;
`;
const SubHeading = styled.h4`
  font-size: 24px;
  font-size: clamp(20px, 3vw, 24px);
  font-family: 'Inter', sans-serif;
  color: #565656;
  font-weight: 700;
  margin-bottom: 1rem;
`;
const Paragraph = styled.p`
  font-size: 16px;
  font-size: clamp(16px, 2vw, 20px);
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

const HeroWrapper = styled.div`
  position: relative;
  &:before {
    content: '';
    position: absolute;
    z-index: -100;
    top: 0%;
    left: -10%;
    width: 100%;
    height: 100%;
    @media (min-width: 1200px) {
      top: 0%;
      width: 70%;
      left: 15%;
    }
    background-image: url(/images/page-support/blob-01.svg);
    background-repeat: no-repeat;
    background-size: contain;
    pointer-events: none;
  }
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

const Button = styled.button`
  background: linear-gradient(to bottom, #FDD85C 0%, #F5C927 100%);
  color: white;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 0.25rem;
  padding: 0.5rem 1rem;
`;

const SupportRow = styled.div`
  margin: 4rem 0;
  gap: 1rem;
  @media (min-width: 1200px) {
    margin: 6rem 0;
    gap: 3rem;
    display: flex;
    align-items: center;
  }
`;

const SupportImage = styled.div`
  position: relative;
  width: 100%;
  @media (min-width: 1200px) {
    max-width: 450px;
  }
`;
const SupportText = styled.div`
  position: relative;
  z-index: 10;
  @media (max-width: 1200px) {
    margin-top: 1rem;
  }
`;

const SupportBlob = styled.div`
  width: 100%;
  height: 130%;
  position: absolute;
  top: -15%;
  left: -15%;
  background-repeat: no-repeat;
  background-size: contain;
  pointer-events: none;
`;

export default function Support() {
  return (
    <>
      <Head>
        <title>Support | Holaplex</title>
        <meta
          property="description"
          key="description"
          content="Our mission is to empower creators and collectors with a suite of tools to create, market, and sell NFTs."
        />
        <body />
      </Head>

      <HeroWrapper>
        <Section>
          <Content className="text-center lg:my-8">
            <div style={{ maxWidth: '1044px' }} className='mx-auto'>
              <Heading>Solanas top community <br className='hidden lg:block' /> supported NFT platform</Heading>
              <Paragraph>
                Web3 is an exciting place but sometimes we need help. We rely on collaboration from members from the community to provide assistance. Get involved by contributing to our wiki page or in our discord.
              </Paragraph>
              <a href='https://docs.holaplex.com/'><Button>Read The Docs</Button></a>
            </div>
          </Content>
        </Section>
      </HeroWrapper>

      <div className="container mx-auto px-6 md:px-12">
        <Section>
          <div className="w-full lg:w-1/2">
            <Content>
              <SubHeading>Need Help?</SubHeading>
              <Heading>Get support from the community</Heading>
            </Content>
          </div>
          <Content>
            <div className='lg:flex lg:gap-4 w-full'>
              <div>
                <Paragraph>
                  <b>Information at your fingertips</b><br />
                  Our documentation is expanding by the day thanks to contributions from our community.<br />
                  <a href="https://wiki.holaplex.com/" style={{ color: '#F7CC34' }}>Find your answer</a>
                </Paragraph>
              </div>
              <div>
                <Paragraph>
                  <b>Get help from the community</b><br />
                  Couldn’t find your answer from the documentation? Ask a member from the community.<br />
                  <a href="https://discord.com/invite/holaplex" style={{ color: '#F7CC34' }}>Join the Discord</a>
                </Paragraph>
              </div>
            </div>
          </Content>
        </Section>

        <Section>
          <Content className="text-center">
            <SubHeading>What product do you need help with?</SubHeading>
            <Heading>Support for all of the <br className='hidden lg:block' /> Holaplex NFT products</Heading>
          </Content>

          <Content>
            <SupportRow>
              <SupportImage>
                <SupportBlob style={{ backgroundImage: 'url(/images/page-support/blob-02.svg)' }} />
                <div className='rounded-lg lg:rounded-2xl w-full overflow-hidden border border-gray-500 z-10 relative aspect-video'>
                  <Image alt='' src={'/images/page-support/mint.jpg'} layout='fill' />
                </div>
              </SupportImage>
              <SupportText>
                <HeadingSmall>Minting NFTs</HeadingSmall>
                <Paragraph>
                  Collection minting of up to 10 NFTs. Found here: holaplex.com/nfts/new
                </Paragraph>
                <a href='https://wiki.holaplex.com/holawiki/minting/how-to-mint-on-holaplex'>
                  <Button>View Docs -&gt;</Button>
                </a>
              </SupportText>
            </SupportRow>

            <SupportRow>
              <SupportImage>
                <SupportBlob style={{ backgroundImage: 'url(/images/page-support/blob-03.svg)' }} />
                <div className='rounded-lg lg:rounded-2xl w-full overflow-hidden border border-gray-500 z-10 relative aspect-video'>
                  <Image alt='' src={'/images/page-support/outkast.jpg'} layout='fill' />
                </div>
              </SupportImage>
              <SupportText>
                <HeadingSmall>Profiles</HeadingSmall>
                <Paragraph>
                  An individual wallet’s profile where you can follow creators, sell, buy and make offers on NFTs.
                </Paragraph>
                <a href='https://wiki.holaplex.com/holawiki/profiles/profiles'>
                  <Button>View Docs -&gt;</Button>
                </a>
              </SupportText>
            </SupportRow>

            <SupportRow>
              <SupportImage>
                <SupportBlob style={{ backgroundImage: 'url(/images/page-support/blob-04.svg)' }} />
                <div className='rounded-lg lg:rounded-2xl w-full overflow-hidden border border-gray-500 z-10 relative aspect-video'>
                  <Image alt='' src={'/images/page-support/monkeydao.jpg'} layout='fill' />
                </div>
              </SupportImage>
              <SupportText>
                <HeadingSmall>Marketplace Standard</HeadingSmall>
                <Paragraph>
                  Home for large collections of NFTs from DAOs, collectives or PFP drops.
                </Paragraph>
                <a href='https://wiki.holaplex.com/holawiki/marketplaces/marketplaces'>
                  <Button>View Docs -&gt;</Button>
                </a>
              </SupportText>
            </SupportRow>

            <SupportRow>
              <SupportImage>
                <SupportBlob style={{ backgroundImage: 'url(/images/page-support/blob-05.svg)' }} />
                <div className='rounded-lg lg:rounded-2xl w-full overflow-hidden border border-gray-500 z-10 relative aspect-video'>
                  <Image alt='' src={'/images/page-support/storefront.jpg'} layout='fill' />
                </div>
              </SupportImage>
              <SupportText>
                <HeadingSmall>Storefronts</HeadingSmall>
                <Paragraph>
                  The original tool from Metaplex’s storefront protocol. Supports bidding, instant sale, and custom branded stores from creators.
                </Paragraph>
                <a href='https://wiki.holaplex.com/holawiki/storefronts/storefronts'>
                  <Button>View Docs -&gt;</Button>
                </a>
              </SupportText>
            </SupportRow>
          </Content>
        </Section>
      </div>

      <div style={{
        backgroundImage: 'url(/images/page-support/dots.jpg)',
      }} className='bg-center bg-no-repeat bg-cover lg:py-32'>
        <Section>
          <Content className="text-center lg:mb-16">
            <Heading>Submit a Bug Ticket</Heading>
            <Paragraph>Still can’t fix the problem or think that there is a bug that needs fixing? Submit a ticket for a community engineer to review. Submit a ticket on discord in the #support-ticket channel.</Paragraph>
            <a href='https://discord.com/invite/holaplex'>
              <Button>Join the Discord</Button>
            </a>
          </Content>
        </Section>
      </div>

      <div style={{
        backgroundImage: 'url(/images/page-support/line-backdrop.svg)',
        backgroundSize: '75%',
      }} className='bg-center bg-repeat-y -mb-20 lg:py-32'>
        <Section>
          <Content className="text-center">
            <SubHeading>Dev Support</SubHeading>
            <Heading>Get started building with our open source tools</Heading>
            <Paragraph>At Holaplex we believe open source is the way to building long term success in the NFT ecosystem. We welcome contributors, integration partners and developers looking to utilize our code to build amazing things.</Paragraph>
            <a href='https://github.com/holaplex'>
              <Button>View our GitHub</Button>
            </a>
          </Content>
        </Section>
      </div>
      <Footer />
    </>
  );
}

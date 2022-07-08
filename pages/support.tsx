import React from 'react';
import Head from 'next/head';
import Footer from 'src/views/home/Footer';
import Image from 'next/image';

type ChildProp = {
  children: React.ReactElement | Array<React.ReactElement | string> | string;
  className?: string;
}

const Heading = function ({ children, className }: ChildProp) {
  return (<h2 className={'font-bold font-sans text-3xl lg:text-6xl capitalize text-transparent bg-clip-text bg-gradient-to-r from-white to-[#808080]' + ' ' + className}>
    {children}
  </h2>)
}

const HeadingSmall = function ({ children, className }: ChildProp) {
  return (<h3 className={'font-bold font-sans my-1 text-2xl lg:text-4xl capitalize' + ' ' + className}>
    {children}
  </h3>)
}

const SubHeading = function ({ children, className }: ChildProp) {
  return (<h4 className={'font-bold text-[#565656] mb-4 font-sans text-xl lg:text-2xl' + ' ' + className}>
    {children}
  </h4>)
}
const Paragraph = function ({ children, className }: ChildProp) {
  return (<p className={'text-gray-300 text-base lg:text-xl' + ' ' + className}>
    {children}
  </p>)
}
const Section = function ({ children, className }: ChildProp) {
  return (<div className={'flex flex-col flex-wrap justify-center px-12 lg:px-24 relative max-w-7xl w-full mx-auto' + ' ' + className}>
    {children}
  </div>)
}

const Content = function ({ children, className }: ChildProp) {
  return (<div className={'max-w-7xl w-full m-auto box-border p-4 relative z-10' + ' ' + className}>
    {children}
  </div>)
}
const Button = function ({ children, className }: ChildProp) {
  return (<button className={'text-white shadow rounded py-2 px-4 bg-gradient-to-b from-[#FDD85C] to-[#F5C927] ' + ' ' + className}>
    {children}
  </button>)
}

const SupportRow = function ({ children, className }: ChildProp) {
  return (<div className={'my-16 lg:my-32 gap-4 lg:gap-12 lg:flex lg:items-center' + ' ' + className}>
    {children}
  </div>)
}

const SupportImage = function ({ children, className }: ChildProp) {
  return (<div className={'w-full lg:max-w-md relative' + ' ' + className}>
    {children}
  </div>)
}

const SupportText = function ({ children, className }: ChildProp) {
  return (<div className={'z-10 relative lg:mt-4' + ' ' + className}>
    {children}
  </div>)
}

const SupportBlob = function ({ children, className }: ChildProp) {
  return (<div className={'absolute w-full h-[130%] top-[-15%] bottom-[-15%] bg-no-repeat bg-contain pointer-events-none' + ' ' + className}>
    {children}
  </div>)
}

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

      <div className='relative'>
        <div className='absolute z-[-100] w-full h-full top-0 left-[-10%] lg:w-[70%] lg:left-[15%] bg-no-repeat bg-contain bg-[url(/images/page-support/blob-01.svg)] pointer-events-none' />
        <Section>
          <Content className="text-center lg:my-12">
            <div className='mx-auto max-w-5xl'>
              <Heading>Solanas top community <br className='hidden lg:block' /> supported NFT platform</Heading>
              <Paragraph>
                Web3 is an exciting place but sometimes we need help. We rely on collaboration from members from the community to provide assistance. Get involved by contributing to our wiki page or in our Discord.
              </Paragraph>
              <a href='https://docs.holaplex.com/'><Button>Read The Docs</Button></a>
            </div>
          </Content>
        </Section>
      </div>

      <div className="container mx-auto px-6 md:px-12 lg:my-12">
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
                  <a target='_blank' rel='noreferrer' href="https://wiki.holaplex.com/" className='text-[#F7CC34]'>Find your answer</a>
                </Paragraph>
              </div>
              <div>
                <Paragraph>
                  <span className="font-bold">Get help from the community</span><br />
                  Couldn’t find your answer from the documentation? Ask a member from the community.<br />
                  <a target='_blank' rel='noreferrer' href="https://discord.com/invite/holaplex" className='text-[#F7CC34]'>Join the Discord</a>
                </Paragraph>
              </div>
            </div>
          </Content>
        </Section>

        <Section className='lg:my-12'>
          <Content className="text-center">
            <SubHeading>What product do you need help with?</SubHeading>
            <Heading>Support for all of the <br className='hidden lg:block' /> Holaplex NFT products</Heading>
          </Content>

          <Content>
            <SupportRow>
              <SupportImage>
                <SupportBlob><Image src='/images/page-support/blob-02.svg' layout='fill' alt='' /></SupportBlob>
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
                <SupportBlob><Image src='/images/page-support/blob-03.svg' layout='fill' alt='' /></SupportBlob>
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
                <SupportBlob><Image src='/images/page-support/blob-04.svg' layout='fill' alt='' /></SupportBlob>
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
                <SupportBlob><Image src='/images/page-support/blob-05.svg' layout='fill' alt='' /></SupportBlob>
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

      <div className='relative lg:py-32'>
        <Image src='/images/page-support/dots.jpg' layout='fill' alt='' />
        <Section className='z-10'>
          <Content className="text-center lg:mb-16">
            <Heading>Submit a Bug Ticket</Heading>
            <Paragraph>Still can’t fix the problem or think that there is a bug that needs fixing? Submit a ticket for a community engineer to review. Submit a ticket on Discord in the #support-ticket channel.</Paragraph>
            <a href='https://discord.com/invite/holaplex'>
              <Button>Join the Discord</Button>
            </a>
          </Content>
        </Section>
      </div>

      <div className='relative -mb-20 lg:py-32'>
        <Image src='/images/page-support/line-backdrop.svg' layout='fill' alt='' />
        <Section className='z-10'>
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

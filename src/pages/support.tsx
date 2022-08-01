import React from 'react';
import Head from 'next/head';
import Footer from 'src/views/home/Footer';
import Image from 'next/image';
import clsx from 'clsx';

type ChildProp = {
  children: React.ReactElement | Array<React.ReactElement | string> | string;
  className?: string;
};

function Heading({ children, className }: ChildProp): JSX.Element {
  return (
    <h2
      className={clsx(
        'bg-gradient-to-r from-white to-[#808080] bg-clip-text font-sans text-3xl font-bold capitalize text-transparent lg:text-6xl',
        className
      )}
    >
      {children}
    </h2>
  );
}

function HeadingSmall({ children, className }: ChildProp): JSX.Element {
  return (
    <h3 className={clsx('my-1 font-sans text-2xl font-bold capitalize lg:text-4xl', className)}>
      {children}
    </h3>
  );
}

function SubHeading({ children, className }: ChildProp): JSX.Element {
  return (
    <h4 className={clsx('mb-4 font-sans text-xl font-bold text-[#565656] lg:text-2xl', className)}>
      {children}
    </h4>
  );
}
function Paragraph({ children, className }: ChildProp): JSX.Element {
  return <p className={clsx('text-base text-gray-300 lg:text-xl', className)}>{children}</p>;
}
function Section({ children, className }: ChildProp): JSX.Element {
  return (
    <div
      className={clsx(
        'relative mx-auto flex w-full max-w-7xl flex-col flex-wrap justify-center px-12 lg:px-24',
        className
      )}
    >
      {children}
    </div>
  );
}

function Content({ children, className }: ChildProp): JSX.Element {
  return (
    <div className={clsx('relative z-10 m-auto box-border w-full max-w-7xl p-4', className)}>
      {children}
    </div>
  );
}
function Button({ children, className }: ChildProp): JSX.Element {
  return (
    <button
      className={clsx(
        'rounded bg-gradient-to-b from-[#FDD85C] to-[#F5C927] py-2 px-4 text-white shadow ',
        className
      )}
    >
      {children}
    </button>
  );
}

function SupportRow({ children, className }: ChildProp): JSX.Element {
  return (
    <div className={clsx('my-16 gap-4 lg:my-32 lg:flex lg:items-center lg:gap-12', className)}>
      {children}
    </div>
  );
}

function SupportImage({ children, className }: ChildProp): JSX.Element {
  return <div className={clsx('relative w-full lg:max-w-md', className)}>{children}</div>;
}

function SupportText({ children, className }: ChildProp): JSX.Element {
  return <div className={clsx('relative z-10 lg:mt-4', className)}>{children}</div>;
}

function SupportBlob({ children, className }: ChildProp): JSX.Element {
  return (
    <div
      className={clsx(
        'pointer-events-none absolute top-[-15%] bottom-[-15%] h-[130%] w-full bg-contain bg-no-repeat',
        className
      )}
    >
      {children}
    </div>
  );
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
      </Head>

      <div className="relative">
        <div className="pointer-events-none absolute top-0 left-[-10%] z-[-100] h-full w-full bg-[url(/images/page-support/blob-01.svg)] bg-contain bg-no-repeat lg:left-[15%] lg:w-[70%]" />
        <Section>
          <Content className="text-center lg:my-12">
            <div className="mx-auto max-w-5xl">
              <Heading>
                Solanas top community <br className="hidden lg:block" /> supported NFT platform
              </Heading>
              <Paragraph>
                Web3 is an exciting place but sometimes we need help. We rely on collaboration from
                members from the community to provide assistance. Get involved by contributing to
                our wiki page or in our Discord.
              </Paragraph>
              <a target="_blank" rel="noreferrer" href="https://docs.holaplex.com/">
                <Button>Read The Docs</Button>
              </a>
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
            <div className="w-full lg:flex lg:gap-4">
              <div>
                <Paragraph>
                  <b>Information at your fingertips</b>
                  <br />
                  Our documentation is expanding by the day thanks to contributions from our
                  community.
                  <br />
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://wiki.holaplex.com/"
                    className="text-[#F7CC34]"
                  >
                    Find your answer
                  </a>
                </Paragraph>
              </div>
              <div>
                <Paragraph>
                  <span className="font-bold">Get help from the community</span>
                  <br />
                  Couldn’t find your answer from the documentation? Ask a member from the community.
                  <br />
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://discord.com/invite/holaplex"
                    className="text-[#F7CC34]"
                  >
                    Join the Discord
                  </a>
                </Paragraph>
              </div>
            </div>
          </Content>
        </Section>

        <Section className="lg:my-12">
          <Content className="text-center">
            <SubHeading>What product do you need help with?</SubHeading>
            <Heading>
              Support for all of the <br className="hidden lg:block" /> Holaplex NFT products
            </Heading>
          </Content>

          <Content>
            <SupportRow>
              <SupportImage>
                <SupportBlob>
                  <Image src="/images/page-support/blob-02.svg" layout="fill" alt="" />
                </SupportBlob>
                <div className="relative z-10 aspect-video w-full overflow-hidden rounded-lg border border-gray-500 lg:rounded-2xl">
                  <Image alt="" src="/images/page-support/mint.jpg" layout="fill" />
                </div>
              </SupportImage>
              <SupportText>
                <HeadingSmall>Minting NFTs</HeadingSmall>
                <Paragraph>
                  Collection minting of up to 10 NFTs. Found here: holaplex.com/nfts/new
                </Paragraph>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://wiki.holaplex.com/holawiki/minting/how-to-mint-on-holaplex"
                >
                  <Button>View Docs -&gt;</Button>
                </a>
              </SupportText>
            </SupportRow>

            <SupportRow>
              <SupportImage>
                <SupportBlob>
                  <Image src="/images/page-support/blob-03.svg" layout="fill" alt="" />
                </SupportBlob>
                <div className="relative z-10 aspect-video w-full overflow-hidden rounded-lg border border-gray-500 lg:rounded-2xl">
                  <Image alt="" src="/images/page-support/outkast.jpg" layout="fill" />
                </div>
              </SupportImage>
              <SupportText>
                <HeadingSmall>Profiles</HeadingSmall>
                <Paragraph>
                  An individual wallet’s profile where you can follow creators, sell, buy and make
                  offers on NFTs.
                </Paragraph>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://wiki.holaplex.com/holawiki/profiles/profiles"
                >
                  <Button>View Docs -&gt;</Button>
                </a>
              </SupportText>
            </SupportRow>

            <SupportRow>
              <SupportImage>
                <SupportBlob>
                  <Image src="/images/page-support/blob-04.svg" layout="fill" alt="" />
                </SupportBlob>
                <div className="relative z-10 aspect-video w-full overflow-hidden rounded-lg border border-gray-500 lg:rounded-2xl">
                  <Image alt="" src="/images/page-support/monkeydao.jpg" layout="fill" />
                </div>
              </SupportImage>
              <SupportText>
                <HeadingSmall>Marketplace Standard</HeadingSmall>
                <Paragraph>
                  Home for large collections of NFTs from DAOs, collectives or PFP drops.
                </Paragraph>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://wiki.holaplex.com/holawiki/marketplaces/marketplaces"
                >
                  <Button>View Docs -&gt;</Button>
                </a>
              </SupportText>
            </SupportRow>

            <SupportRow>
              <SupportImage>
                <SupportBlob>
                  <Image src="/images/page-support/blob-05.svg" layout="fill" alt="" />
                </SupportBlob>
                <div className="relative z-10 aspect-video w-full overflow-hidden rounded-lg border border-gray-500 lg:rounded-2xl">
                  <Image alt="" src="/images/page-support/storefront.jpg" layout="fill" />
                </div>
              </SupportImage>
              <SupportText>
                <HeadingSmall>Storefronts</HeadingSmall>
                <Paragraph>
                  The original tool from Metaplex’s storefront protocol. Supports bidding, instant
                  sale, and custom branded stores from creators.
                </Paragraph>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://wiki.holaplex.com/holawiki/storefronts/storefronts"
                >
                  <Button>View Docs -&gt;</Button>
                </a>
              </SupportText>
            </SupportRow>
          </Content>
        </Section>
      </div>

      <div className="relative lg:py-32">
        <Image src="/images/page-support/dots.jpg" layout="fill" alt="" />
        <Section className="z-10">
          <Content className="text-center lg:mb-16">
            <Heading>Submit a Bug Ticket</Heading>
            <Paragraph>
              Still can’t fix the problem or think that there is a bug that needs fixing? Submit a
              ticket for a community engineer to review. Submit a ticket on Discord in the
              #support-ticket channel.
            </Paragraph>
            <a target="_blank" rel="noreferrer" href="https://discord.com/invite/holaplex">
              <Button>Join the Discord</Button>
            </a>
          </Content>
        </Section>
      </div>

      <div className="relative -mb-20 lg:py-32">
        <Image src="/images/page-support/line-backdrop.svg" layout="fill" alt="" />
        <Section className="z-10">
          <Content className="text-center">
            <SubHeading>Dev Support</SubHeading>
            <Heading>Get started building with our open source tools</Heading>
            <Paragraph>
              At Holaplex we believe open source is the way to building long term success in the NFT
              ecosystem. We welcome contributors, integration partners and developers looking to
              utilize our code to build amazing things.
            </Paragraph>
            <a target="_blank" rel="noreferrer" href="https://github.com/holaplex">
              <Button>View our GitHub</Button>
            </a>
          </Content>
        </Section>
      </div>
      <Footer />
    </>
  );
}

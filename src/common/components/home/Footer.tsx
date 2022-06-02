import Link from 'next/link';
import React, { FC, VFC } from 'react';
import SocialLinks from '../elements/SocialLinks';

export const SmallFooter = () => {
  return (
    <div className="mb-7 flex max-w-md flex-col items-center space-y-6 md:items-start">
      <div className="flex flex-nowrap items-center text-center text-2xl">
        <div className="flex h-10 w-10 items-center justify-center">👋</div>
        <span className="font-medium text-gray-25">Holaplex</span>
      </div>
      <SocialLinks />
    </div>
  );
};

const Footer: VFC = () => {
  return (
    <footer className="mt-20 bg-gray-800 p-10">
      <div className="flex flex-row flex-wrap justify-center md:justify-between">
        <div className="mb-7 flex max-w-md flex-col items-center space-y-7 md:items-start">
          <InternalLink href="/">
            <div className="flex flex-nowrap items-center text-center text-2xl">
              <div className="flex h-10 w-10 items-center justify-center">👋</div>
              <span className="font-medium text-gray-25">Holaplex</span>
            </div>
          </InternalLink>
          <div className="text-center text-base text-gray-300 md:text-left">
            The only truly open-sourced, decentralized & community-governed NFT platform on Solana.
          </div>
          <SocialLinks />
        </div>
        <div className="grid grid-cols-1 justify-center gap-12 md:grid-cols-4 md:justify-start">
          <div className="justify-center text-center md:justify-start md:text-left">
            <span className="text-base font-medium text-white">About</span>
            <ul className="mt-4 space-y-2">
              <li>
                <InternalLink href="/about">About Holaplex</InternalLink>
              </li>
              <li>
                <ExternalLink href="https://docs.google.com/document/d/1jskpoCdDm7DU2IbeXwRhhl5LGiNhonAx2HsmfJlDsEs">
                  Terms of Service
                </ExternalLink>
              </li>
              <li>
                <ExternalLink href="https://docs.google.com/document/d/12uQU7LbLUd0bY7Nz13-F9cua5Wk8mnRNBlyDzF6gRmo">
                  Privacy Policy
                </ExternalLink>
              </li>
            </ul>
          </div>
          <div className="justify-center text-center md:justify-start md:text-left">
            <span className="text-base font-medium text-white">Create</span>
            <ul className="mt-4 space-y-2">
              <li>
                <InternalLink href="/nfts/new">Mint NFTs</InternalLink>
              </li>
              <li>
                <InternalLink href="/marketplace/new">
                  <TaggedNew>Marketplaces</TaggedNew>
                </InternalLink>
              </li>
              <li>
                <InternalLink href="/storefront/new">New storefront</InternalLink>
              </li>
              <li>
                <InternalLink href="/storefront/edit">Edit storefront</InternalLink>
              </li>
            </ul>
          </div>
          <div className="justify-center text-center md:justify-start md:text-left">
            <span className="text-base font-medium text-white">Community</span>
            <ul className="mt-4 space-y-2">
              <li>
                <ExternalLink href="https://github.com/holaplex">GitHub Repos</ExternalLink>
              </li>
              <li>
                <ExternalLink href={'https://blog.holaplex.com/'}>Blog</ExternalLink>
              </li>
              <li>
                <ExternalLink href={'https://holaplex2.activehosted.com/f/3'}>
                  Newsletter
                </ExternalLink>
              </li>
              <li>
                <ExternalLink href="#">Hola Collective</ExternalLink>
              </li>
              <li>
                <ExternalLink href="https://mobile.twitter.com/holalistings">
                  HolaListings
                </ExternalLink>
              </li>
            </ul>
          </div>
          <div className="justify-center text-center md:justify-start md:text-left">
            <span className="text-base font-medium text-white">Help</span>
            <ul className="mt-4 space-y-2">
              <li>
                <ExternalLink href="https://wiki.holaplex.com/Help-Desk/FAQ">FAQs</ExternalLink>
              </li>
              <li>
                <ExternalLink href="https://wiki.holaplex.com/">Support</ExternalLink>
              </li>
              <li>
                <ExternalLink href="https://twitter.com/holastatus">HolaStatus</ExternalLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

interface LinkProps {
  href: string;
}

const InternalLink: FC<LinkProps> = ({ href, children }) => (
  <Link href={href} passHref>
    <a href={href} className="text-base font-medium text-gray-300">
      {children}
    </a>
  </Link>
);

const ExternalLink: FC<LinkProps> = ({ href, children }) => (
  <a href={href} target="_blank" rel="noreferrer" className="text-base font-medium text-gray-300">
    {children}
  </a>
);

const TaggedNew: FC = ({ children }) => (
  <div className="flex justify-center md:justify-start">
    <div className="relative">
      {children}
      {/* position absolute to avoid affecting other child elements
            position vertically centered by translating 50% from top
            position to the right of the last child by translating 100% and adding a right offset */}
      <div className="absolute -right-3 top-1/2 translate-x-full -translate-y-1/2 rounded bg-gray-900 p-1 text-center text-sm font-medium text-white">
        New
      </div>
    </div>
  </div>
);

export default Footer;

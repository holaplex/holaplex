import React, { FC, VFC } from 'react';
import SocialLinks from '../elements/SocialLinks';

const Footer: VFC = () => {
  return (
    <footer className="mt-20 bg-gray-800 p-10">
      <div className="flex flex-row flex-wrap justify-between">
        <div className="mb-7 flex max-w-md flex-col space-y-7">
          <div className="flex flex-nowrap items-center text-center text-2xl">
            <div className="flex h-10 w-10 items-center justify-center">👋</div>
            <span className="font-medium text-gray-25">Holaplex</span>
          </div>
          <div className="text-base text-gray-300">
            The only truly open-sourced, decentralized & community-governed NFT platform on Solana.
          </div>
          <SocialLinks />
        </div>
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="justify-start">
            <span className="text-base font-medium text-white">About</span>
            <ul className="mt-4 space-y-2">
              <li>
                <FooterLink href="/about">About Holaplex</FooterLink>
              </li>
              <li>
                <FooterLink
                  newTab
                  href="https://docs.google.com/document/d/1jskpoCdDm7DU2IbeXwRhhl5LGiNhonAx2HsmfJlDsEs"
                >
                  Terms of Service
                </FooterLink>
              </li>
              <li>
                <FooterLink
                  newTab
                  href="https://docs.google.com/document/d/12uQU7LbLUd0bY7Nz13-F9cua5Wk8mnRNBlyDzF6gRmo"
                >
                  Privacy Policy
                </FooterLink>
              </li>
            </ul>
          </div>
          <div className="justify-start">
            <span className="text-base font-medium text-white">Create</span>
            <ul className="mt-4 space-y-2">
              <li>
                <FooterLink href="/nfts/new">Mint NFTs</FooterLink>
              </li>
              <li>
                <FooterLink href="/marketplace/new">
                  <TaggedNew>Marketplaces</TaggedNew>
                </FooterLink>
              </li>
              <li>
                <FooterLink href="/storefront/new">Set up a storefront</FooterLink>
              </li>
            </ul>
          </div>
          <div className="justify-start">
            <span className="text-base font-medium text-white">Community</span>
            <ul className="mt-4 space-y-2">
              <li>
                <FooterLink newTab href="https://github.com/holaplex">
                  GitHub Repos
                </FooterLink>
              </li>
              <li>
                <FooterLink newTab href="#">
                  Hola Collective
                </FooterLink>
              </li>
              <li>
                <FooterLink href="https://mobile.twitter.com/holalistings">HolaListings</FooterLink>
              </li>
            </ul>
          </div>
          <div className="justify-start">
            <span className="text-base font-medium text-white">Help</span>
            <ul className="mt-4 space-y-2">
              <li>
                <FooterLink
                  newTab
                  href="https://holaplex-support.zendesk.com/hc/en-us/sections/4407417107475-FAQ"
                >
                  FAQs
                </FooterLink>
              </li>
              <li>
                <FooterLink
                  newTab
                  href="https://holaplex-support.zendesk.com/hc/en-us/requests/new"
                >
                  Support
                </FooterLink>
              </li>
              <li>
                <FooterLink newTab href="https://twitter.com/holastatus">
                  HolaStatus
                </FooterLink>
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
  newTab?: boolean;
}

const FooterLink: FC<LinkProps> = (props) => {
  return (
    <a
      href={props.href}
      target={props.newTab ? '_blank' : undefined}
      rel="noreferrer"
      className="text-base font-medium text-gray-300"
    >
      {props.children}
    </a>
  );
};

const TaggedNew: FC = (props) => {
  return (
    <div className="flex flex-nowrap">
      {props.children}
      <div className="ml-3 rounded bg-gray-900 p-1 text-center text-sm font-medium text-white">
        New
      </div>
    </div>
  );
};

export default Footer;

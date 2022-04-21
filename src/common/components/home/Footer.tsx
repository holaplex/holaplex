import React, { FC, VFC } from 'react';
import SocialLinks from '../elements/SocialLinks';

const Footer: VFC = () => {
    return (
        <footer className="bg-gray-800 p-10">
            <div className="flex flex-row flex-wrap justify-center md:justify-between">
                <div className="flex flex-col max-w-md space-y-7 mb-7 items-center md:items-start">
                    <div className="flex flex-nowrap items-center text-center text-2xl">
                        <div className="w-10 h-10 flex items-center justify-center">👋</div>
                        <span className="text-gray-25 font-medium">Holaplex</span>
                    </div>
                    <div className="text-base text-gray-300 text-center md:text-left">
                        The only truly open-sourced, decentralized & 
                        community-governed NFT platform on Solana.
                    </div>
                    <SocialLinks/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 justify-center md:justify-start border border-green">
                    <div className="justify-center md:justify-start text-center md:text-left">
                        <span className="text-white text-base font-medium">About</span>
                        <ul className="mt-4 space-y-2">
                            <li><FooterLink href="/about">About Holaplex</FooterLink></li>
                            <li><FooterLink newTab href="https://docs.google.com/document/d/1jskpoCdDm7DU2IbeXwRhhl5LGiNhonAx2HsmfJlDsEs">Terms of Service</FooterLink></li>
                            <li><FooterLink newTab href="https://docs.google.com/document/d/12uQU7LbLUd0bY7Nz13-F9cua5Wk8mnRNBlyDzF6gRmo">Privacy Policy</FooterLink></li>
                        </ul>
                    </div>
                    <div className="justify-center md:justify-start text-center md:text-left">
                        <span className="text-white text-base font-medium">Create</span>
                        <ul className="mt-4 space-y-2">
                            <li><FooterLink href="/nfts/new">Mint NFTs</FooterLink></li>
                            <li><FooterLink href="/marketplace/new"><TaggedNew>Marketplaces</TaggedNew></FooterLink></li>
                            <li><FooterLink href="/storefront/new">Set up a storefront</FooterLink></li>
                        </ul>
                    </div>
                    <div className="justify-center md:justify-start text-center md:text-left">
                        <span className="text-white text-base font-medium">Community</span>
                        <ul className="mt-4 space-y-2">
                            <li><FooterLink newTab href="https://github.com/holaplex">GitHub Repos</FooterLink></li>
                            <li><FooterLink newTab href="#">Hola Collective</FooterLink></li>
                            <li><FooterLink href="https://mobile.twitter.com/holalistings">HolaListings</FooterLink></li>
                        </ul>
                    </div>
                    <div className="justify-center md:justify-start text-center md:text-left">
                        <span className="text-white text-base font-medium">Help</span>
                        <ul className="mt-4 space-y-2">
                            <li><FooterLink newTab href="https://holaplex-support.zendesk.com/hc/en-us/sections/4407417107475-FAQ">FAQs</FooterLink></li>
                            <li><FooterLink newTab href="https://holaplex-support.zendesk.com/hc/en-us/requests/new">Support</FooterLink></li>
                            <li><FooterLink newTab href="https://twitter.com/holastatus">HolaStatus</FooterLink></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
}


interface LinkProps {
    href: string;
    newTab?: boolean;
}

const FooterLink: FC<LinkProps> = props => {
    return <a href={props.href} target={props.newTab ? "_blank" : undefined}  rel="noreferrer" className="text-base text-gray-300 font-medium">{props.children}</a>
}

const TaggedNew: FC = props => {
    return <div className="flex justify-center">
        <div className="relative">
            {props.children}
            {/* position absolute to avoid affecting other child elements
            position vertically centered by translating 50% from top
            position to the right of the last child by translating 100% and adding a right offset */}
            <div className="absolute -right-3 translate-x-full top-1/2 -translate-y-1/2 bg-gray-900 rounded text-white text-sm text-center p-1 font-medium">New</div>
        </div>
    </div>;
}

export default Footer;
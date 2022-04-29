import MarketplacePreview from '@/common/components/home/MarketplacePreview';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import { FC } from 'react';
import Carousel from 'react-grid-carousel';

const featuredMarketplaces: string[] = [
  'junglecats',
  'cityshop',
  'thechimpions',
  'skeletoncrew',
  'monkedao',
  'ursmarket',
  'pixelbands',
  'thislooksrare',
  'shiguardians',
  'mortuary',
  'kurumanft',
  'paragon',
];

const FeaturedMarkeplacesSection: FC = () => {
  return (
        <div>

          {/* header  */}
          <div className="mb-4 flex flex-row items-center justify-between border-b border-gray-800 p-2">
            <span className="text-lg font-medium text-white">Marketplaces</span>
            <ExternalLink href="https://marketplace.holaplex.com/waitlist">Join waitlist</ExternalLink>
          </div>

          {/* body */}
          <div>
          <Carousel
          cols={3}
          rows={2}
          gap={0}
          arrowLeft={PageLeftButton}
          arrowRight={PageRightButton}
        >
          {featuredMarketplaces.map((s) => (
            <Carousel.Item key={s}>
              <div key={s} className="aspect-[16/10] w-full p-2">
                <MarketplacePreview subdomain={s} />
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
          </div>
        </div>
  );
};

interface HomeLinkProps {
  href: string;
}

const InternalLink: FC<HomeLinkProps> = ({ href, children }) => (
  <Link href={href} passHref>
    <a
      href={href}
      className="flex flex-nowrap items-center stroke-gray-300 text-sm font-medium text-gray-300 hover:scale-105 hover:stroke-white hover:transition"
    >
      {children}
    </a>
  </Link>
);

const ExternalLink: FC<HomeLinkProps> = ({ href, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="flex flex-nowrap items-center stroke-gray-300 text-sm font-medium text-gray-300 hover:scale-105 hover:stroke-white hover:transition"
  >
    {children}
  </a>
);


const PageLeftButton = (
  <button
    className="flex items-center justify-center absolute left-0 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-900 stroke-white p-1 shadow shadow-black hover:scale-125 transition"
  >
    <ChevronLeftIcon className="h-4 w-4" />
  </button>
);

const PageRightButton = (
  <button
    className="flex items-center justify-center absolute right-0 top-1/2 h-10 w-10 translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-900 stroke-white p-1 shadow shadow-black hover:scale-125 transition"
  >
    <ChevronRightIcon className="h-4 w-4" />
  </button>
);


export default FeaturedMarkeplacesSection;
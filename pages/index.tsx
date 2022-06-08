import FeaturedAuctionsSection from '@/common/components/home/FeaturedAuctionsSection';
import FeaturedBuyNowListingsSection from '@/common/components/home/FeaturedBuyNowListingsSection';
import FeaturedMarketplacesSection from '@/common/components/home/FeaturedMarketplacesSection';
import FeaturedProfilesSection from '@/common/components/home/FeaturedProfilesSection';
import Footer from '@/common/components/home/Footer';
import HeroSection from '@/common/components/home/HeroSection';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import Link from 'next/link';
import { FC, ReactNode } from 'react';
import Carousel from 'react-grid-carousel';

const Home: FC = () => {
  return (
    <div>
      <HeroSection />
      <div className="container mx-auto w-[88%] md:w-3/4">
        <FeaturedBuyNowListingsSection />
        <FeaturedProfilesSection />
        <FeaturedAuctionsSection />
        <FeaturedMarketplacesSection />
      </div>
      <Footer />
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
  <button className="absolute left-4 top-1/2 z-50 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-gray-900 stroke-white p-1 shadow shadow-black transition hover:scale-125">
    <ChevronLeftIcon className="h-4 w-4" />
  </button>
);

const PageRightButton = (
  <button className="absolute right-4 top-1/2 z-50 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-gray-900 stroke-white p-1 shadow shadow-black transition hover:scale-125">
    <ChevronRightIcon className="h-4 w-4" />
  </button>
);

type Header = FC;
type Title = FC;
type HeaderAction<T> = FC<T>;
type Body = FC;

type HomeSectionSubtypes = {
  Header: Header;
  Title: Title;
  HeaderAction: HeaderAction<HeaderActionProps>;
  Body: Body;
};

/**
 * Compound component for preview sections in the v2 homepage. Contains a title,
 * linked call to action, and body, e.g.
 *
 * ```
 *  <HomeSection>
 *      <HomeSection.Header>
 *          <HomeSection.Title>Holaplex Preview</HomeSection.Title>
 *          <HomeSection.HeaderAction newTab href="www.holaplex.com">Go home</HomeSection.HeaderAction>
 *      </HomeSection.Header>
 *      <HomeSection.Body>
 *          <SomeAmazingCustomContent/>
 *      </HomeSection.Body>
 *  </HomeSection>
 * ```
 */
export const HomeSection: FC & HomeSectionSubtypes = ({ children }) => (
  <div className="my-24 sm:my-40">{children}</div>
);

const HomeSectionHeader: Header = ({ children }) => (
  <div className="mb-4 flex flex-row items-center justify-between border-b border-gray-800 p-2">
    {children}
  </div>
);
HomeSection.Header = HomeSectionHeader;

const HomeSectionTitle: Title = ({ children }) => (
  <span className="text-lg font-medium text-white">{children}</span>
);
HomeSection.Title = HomeSectionTitle;

interface HeaderActionProps {
  href: string;
  external?: boolean;
}

const HomeSectionHeaderAction: HeaderAction<HeaderActionProps> = ({ href, external, children }) => {
  const LinkComponent: FC<HomeLinkProps> = external ? ExternalLink : InternalLink;
  return (
    <LinkComponent href={href}>
      {children}
      <ChevronRightIcon className="ml-2 h-4" />
    </LinkComponent>
  );
};
HomeSection.HeaderAction = HomeSectionHeaderAction;

/**
 * Container for main body of each home section. Add whatever content you want as children.
 */
const HomeSectionBody: Body = ({ children }) => <div>{children}</div>;
HomeSection.Body = HomeSectionBody;

type Item = FC<{ children: ReactNode | ReactNode[]; className?: string }>;

type HomeSectionCarouselSubtypes = {
  Item: Item;
};

interface HomeSectionCarouselProps {
  rows: number;
  cols: number;
  gap?: number;
}

export const HomeSectionCarousel: FC<HomeSectionCarouselProps> & HomeSectionCarouselSubtypes = ({
  rows,
  cols,
  gap = 0,
  children,
}) => (
  // enlarge the carousel section to account for internal padding of elements such that elements still fill
  // the space
  <div className="-ml-[3%] w-screen overflow-visible md:w-[106%]">
    <Carousel
      rows={rows}
      cols={cols}
      gap={gap}
      arrowLeft={PageLeftButton}
      arrowRight={PageRightButton}
      containerStyle={{ overflow: 'visible' }}
    >
      {children}
    </Carousel>
  </div>
);

const HomeSectionCarouselItem: Item = ({ children, className }) => (
  <div className={classNames('snap-center overflow-visible', className)}>{children}</div>
);
// this is a hack to get the carousel to display custom-styled items
// https://github.com/x3388638/react-grid-carousel/blob/master/src/components/Carousel.js#L206-L212
HomeSectionCarouselItem.displayName = 'CAROUSEL_ITEM';
HomeSectionCarousel.Item = HomeSectionCarouselItem;

export default Home;

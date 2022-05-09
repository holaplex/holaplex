import FeaturedBuyNowListingsSection from '@/common/components/home/FeaturedBuyNowListingsSection';
import FeaturedMarkeplacesSection from '@/common/components/home/FeaturedMarketplacesSection';
import Footer from '@/common/components/home/Footer';
import { recallCache } from '@apollo/client/cache/inmemory/reactiveVars';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import { FC } from 'react';
import Carousel from 'react-grid-carousel';

const Home: FC = () => {
  return (
    <>
      <div className="container mx-auto w-[80%] pb-48">
        <FeaturedMarkeplacesSection />
        <FeaturedBuyNowListingsSection />
      </div>
      <Footer />
    </>
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
  <button className="absolute left-0 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gray-900 stroke-white p-1 shadow shadow-black transition hover:scale-125">
    <ChevronLeftIcon className="h-4 w-4" />
  </button>
);

const PageRightButton = (
  <button className="absolute right-0 top-1/2 flex h-10 w-10 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gray-900 stroke-white p-1 shadow shadow-black transition hover:scale-125">
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
export const HomeSection: FC & HomeSectionSubtypes = ({ children }) => <div>{children}</div>;

const HomeSectionHeader: Header = ({ children }) => (
  //TODO revert when ready to swap to new homepage
  <div className="flex justify-between">
    {/* <div className="mb-4 flex flex-row items-center justify-between border-b border-gray-800 p-2"> */}
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

type Item = FC;

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
  <div className="-ml-[2%] w-[104%]">
    <Carousel
      rows={rows}
      cols={cols}
      gap={gap}
      arrowLeft={PageLeftButton}
      arrowRight={PageRightButton}
    >
      {children}
    </Carousel>
  </div>
);

HomeSectionCarousel.Item = Carousel.Item;

export default Home;

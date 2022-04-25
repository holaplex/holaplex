import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';
import { VFC } from 'react';
import HomeSection from './HomeSection';
import MarketplacePreview from './MarketplacePreview';
import Carousel from 'react-grid-carousel';

const previewSubdomains: string[] = [
  'junglecats',
  'monokedao',
  'junglecats',
  'junglecats',
  'junglecats',
  'junglecats',
  'junglecats',
  'junglecats',
  'junglecats',
];

const PageLeftButton = (
  <button
    className="absolute left-0 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-900 stroke-white p-1 shadow shadow-black hover:scale-105"
  >
    <ChevronLeftIcon />
  </button>
);

const PageRightButton = (
  <button
    className="absolute right-0 top-1/2 h-10 w-10 translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-900 stroke-white p-1 shadow shadow-black hover:scale-105"
  >
    <ChevronRightIcon />
  </button>
);

const FeaturedMarkeplacesSection: VFC = () => {
  return (
    <HomeSection>
      <HomeSection.Header>
        <HomeSection.Title>Marketplaces</HomeSection.Title>
        <HomeSection.HeaderAction external href="https://marketplace.holaplex.com/waitlist">
          Join waitlist
        </HomeSection.HeaderAction>
      </HomeSection.Header>
      <HomeSection.Body>
        <Carousel
          cols={2}
          rows={2}
          gap={10}
          arrowLeft={PageLeftButton}
          arrowRight={PageRightButton}
        >
          {previewSubdomains.map((s) => (
            <Carousel.Item key={s}>
              <div key={s} className="aspect-[16/10] w-full p-4 overflow:visible">
                <MarketplacePreview subdomain={s} />
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </HomeSection.Body>
    </HomeSection>
  );
};

export default FeaturedMarkeplacesSection;

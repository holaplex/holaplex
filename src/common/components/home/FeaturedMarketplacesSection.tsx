import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';
import { MouseEventHandler, MutableRefObject, UIEvent, UIEventHandler, useEffect, useRef, useState, VFC } from 'react';
import HomeSection from './HomeSection';
import MarketplacePreview from './MarketplacePreview';

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

const FeaturedMarkeplacesSection: VFC = () => {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const previewsContainer: MutableRefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);

  const onClickScrollLeftButton: MouseEventHandler<HTMLButtonElement> = () => {
    if (canScrollLeft && previewsContainer.current) {
      previewsContainer.current.scrollBy(-200, 0);
      
    }
  }

  const onClickScrollRightButton: MouseEventHandler<HTMLButtonElement> = () => {
    if (canScrollRight && previewsContainer.current) {
      previewsContainer.current.scrollBy(200, 0);
    }
  }

  const updateFromScrolling: () => void = () => {
    if (previewsContainer.current) {
      const scrollDistanceFromLeft: number = previewsContainer.current.scrollLeft;
      if (scrollDistanceFromLeft == 0) setCanScrollLeft(false);
      else setCanScrollLeft(true);
  
      const scrollDistanceFromRight: number =
        1 - (scrollDistanceFromLeft + previewsContainer.current.offsetWidth) / previewsContainer.current.scrollWidth;
      if (scrollDistanceFromRight == 0) setCanScrollRight(false);
      else setCanScrollRight(true);
    }
  }


  useEffect(updateFromScrolling);


  return (
    <HomeSection>
      <HomeSection.Header>
        <HomeSection.Title>Marketplaces</HomeSection.Title>
        <HomeSection.HeaderAction external href="https://marketplace.holaplex.com/waitlist">
          Join waitlist
        </HomeSection.HeaderAction>
      </HomeSection.Header>
      <HomeSection.Body>
        <div className="relative">
          <div
            ref={previewsContainer}
            onScroll={updateFromScrolling}
            className="grid grid-flow-col grid-rows-2 gap-6 overflow-x-scroll p-4 md:gap-8"
          >
            {previewSubdomains.map((s) => (
              <div key={s} className="aspect-[16/10] min-h-[194px] w-full md:min-h-[300px]">
                <MarketplacePreview subdomain={s} />
              </div>
            ))}
          </div>
          <button
            onClick={onClickScrollLeftButton}
            className={`${
              canScrollLeft ? '' : 'hidden'
            } absolute left-0 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-900 stroke-white p-1 shadow shadow-black hover:scale-105`}
          >
            <ChevronLeftIcon />
          </button>
          <button
            onClick={onClickScrollRightButton}
            className={`${
              canScrollRight ? '' : 'hidden'
            } absolute right-0 top-1/2 h-10 w-10 translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-900 stroke-white p-1 shadow shadow-black hover:scale-105`}
          >
            <ChevronRightIcon />
          </button>
        </div>
      </HomeSection.Body>
    </HomeSection>
  );
};

export default FeaturedMarkeplacesSection;

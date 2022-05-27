import classNames from 'classnames';
import { RefObject, useCallback, useEffect, useRef, useState } from 'react';

interface ItemProps {
  children: JSX.Element | JSX.Element[];
  className?: string;
  style?: string;
}

interface Item {
  (props: ItemProps): JSX.Element;
}

type CarouselSubtypes = {
  Item: Item;
};

type AnimationStyle = 'none' | 'slide' | 'fade';

export interface CarouselProps {
  rows?: number;
  cols?: number;
  gap?: number;
  animation?: AnimationStyle;
  style?: object;
  className?: string;
  children?: JSX.Element[];
}

const Carousel = ({
  rows = 1,
  cols = 1,
  gap = 10,
  animation = 'slide',
  style,
  className,
  children,
}: CarouselProps): JSX.Element => {
  const rowsClass: string = rows ? `grid-rows-${rows}` : '';
  const colsClass: string = cols ? `grid-cols-${cols}` : '';
  const gapClass: string= gap !== undefined ? `gap-[${gap}px]` : '';
  const pageGridClass: string = `grid ${rowsClass} ${colsClass} ${gapClass} w-full overflow-visible border-2 border-red-500`;

  const nElementsPerPage: number = rows * cols;
  // have at least one page even when there's no children
  const nPages: number = Math.max(1, Math.ceil((children?.length || 0) / nElementsPerPage));

  const [page, setPage] = useState<number>(0);
  const [carouselAnimationClass, setCarouselAnimationClass] = useState<string>('');
  const [pageAnimationClasses, setPageAnimationClasses] = useState<string[]>(Array(nPages).fill(''));
  const carouselRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

  // animation/transition settings
  useEffect(() => {
    if (carouselRef.current) {
      //TODO move to function
      const newPageClasses: string[] = [];
      let newCarouselClass: string;
      switch (animation) {
        case 'slide': {
          newCarouselClass = 'overflow-x-scroll scroll-smooth';
          for (let i = 0; i < nPages; i++) {
            // need one page to not be absolutely positioned to allow for flex sizing to work
            // TODO is this a safe way to style? Because that means every page will be sized according
            //  to the first page. Alternatively we could translate the pages instead of scrolling, but
            //  that would break built-in scrolling if that's something we want to keep.
            if (i === 0) newPageClasses.push('');
            else newPageClasses.push(`absolute top-0 left-[${i * 100}%]`);
          }
          carouselRef.current.scrollTo({ left: carouselRef.current.scrollWidth * (page / 3) });
          break;
        }
        case 'fade': {
          newCarouselClass = '';
          for (let i = 0; i < nPages; i++) {
            // need one page to not be absolutely positioned to allow for flex sizing to work
            const pageOffset: number = i - page;
            newPageClasses.push(
              //TODO replace with classNames()?
              `${pageOffset === 0 ? '' : 'absolute top-0 left-0'} transition-opacity duration-700 ease-in opacity-${pageOffset === 0 ? 100 : 0}`
            );
          }
          carouselRef.current.scroll(0, 0);
          break;
        }
        default: {
          newCarouselClass = '';
          newPageClasses.push(...Array(nPages).fill(''));
        }
      }
      console.log(newPageClasses);
      setCarouselAnimationClass(newCarouselClass);
      setPageAnimationClasses(newPageClasses);
    }
  }, 
  
  // style and className need to be dependencies in case the user specifies custom styling that changes the
  //  number of pages or size of each page
  [page, animation, nPages, style, className]);

  return (
    <>
      <div
        ref={carouselRef}
        className={`${carouselAnimationClass} relative max-w-full overflow-visible`}
      >
        {/* main problem with this approach (one grid per page) means you might have different styling/sizing per page */}
        <div
          className={`${pageGridClass} ${pageAnimationClasses[0]}`}
        >
          <div className="flex items-center justify-center rounded-md bg-cyan-400">1</div>
          <div className="flex items-center justify-center rounded-md bg-cyan-400">2</div>
          <div className="flex items-center justify-center rounded-md bg-cyan-400">3</div>
          <div className="flex items-center justify-center rounded-md bg-cyan-400">4</div>
        </div>
        <div
          className={`${pageGridClass} ${pageAnimationClasses[1]}`}
        >
          <div className="flex items-center justify-center rounded-md bg-pink-400">5</div>
          <div className="flex items-center justify-center rounded-md bg-pink-400">6</div>
          <div className="flex items-center justify-center rounded-md bg-pink-400">7</div>
          <div className="flex items-center justify-center rounded-md bg-pink-400">8</div>
        </div>
        <div
          className={`${pageGridClass} ${pageAnimationClasses[2]}`}
        >
          <div className="flex items-center justify-center rounded-md bg-green-400">9</div>
          <div className="flex items-center justify-center rounded-md bg-green-400">10</div>
          <div className="flex items-center justify-center rounded-md bg-green-400">11</div>
          <div className="flex items-center justify-center rounded-md bg-green-400">12</div>
        </div>
      </div>
      <div className="flex justify-between">
        <button className="flex bg-red-500" onClick={() => setPage(Math.max(0, page - 1))}>
          Previous
        </button>
        <button className="flex bg-red-500" onClick={() => setPage(Math.min(2, page + 1))}>
          Next
        </button>
      </div>
    </>
  );
};


// TODO expose styling in the Carousel component
// const CarouselPage = ({children, className, style}: )

const CarouselItem = ({ children, className, style }: ItemProps): JSX.Element => (
  <div>{children}</div>
);
Carousel.Item = CarouselItem;

export default Carousel;

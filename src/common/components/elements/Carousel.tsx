import classNames from 'classnames';
import { RefObject, useMemo, useRef, useState } from 'react';

//TODO 
//  - reduce number of initial renders to 1
//  - check shadow stuff
//  - change default button classes
//  - expose pagination button classes
//  - make progress dots
//  - expose slider visibility 
//  - expose slider styling (also allows for setting visibility?)

interface ItemProps {
  children: JSX.Element | JSX.Element[];
  className?: string;
  style?: object;
}

type AnimationStyle = 'none' | 'slide' | 'fade';

interface ICarouselItem {
  (props: ItemProps): JSX.Element;
}

const CarouselItem: ICarouselItem = ({ children, className, style = {} }) => (
  //TODO does the item need any classes?
  <div className={classNames('', className)} style={style}>
    {children}
  </div>
);

export interface CarouselProps {
  rows?: number;
  cols?: number;
  gap?: number;
  animation?: AnimationStyle;
  style?: object;
  className?: string;
  pageStyle?: object;
  pageClassName?: string;
  children?: JSX.Element | JSX.Element[];
}

const Carousel = ({
  rows = 1,
  cols = 1,
  gap = 10,
  animation = 'slide',
  style,
  className,
  pageStyle,
  pageClassName,
  children = [],
}: CarouselProps): JSX.Element => {
  const childArray = useMemo<JSX.Element[]>(() => {
    if (children === undefined) return [];
    else if (!Array.isArray(children)) return [children];
    else return children;
  }, [children]);

  const nElementsPerPage: number = rows * cols;
  // have at least one page even when there's no children
  const nPages: number = Math.max(1, Math.ceil(childArray.length / nElementsPerPage));

  const [page, setPage] = useState<number>(0);
  const [carouselAnimationClass, setCarouselAnimationClass] = useState<string>('');
  const [pageAnimationClasses, setPageAnimationClasses] = useState<string[]>(
    Array(nPages).fill('')
  );
  const carouselRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

  useMemo(
    () => {
      switch (animation) {
        case 'slide': {
          updateSlideAnimation();
          break;
        }
        case 'fade': {
          updateFadeAnimation();
          break;
        }
        default: {
          updateDefaultAnimation();
        }
      }

      function updateSlideAnimation(): void {
        const pageClasses: string[] = [];
        for (let i = 0; i < nPages; i++) {
          pageClasses.push(`flex min-w-full`);
        }
        setCarouselAnimationClass('flex flex-row flex-nowrap overflow-x-scroll scroll-smooth');
        setPageAnimationClasses(pageClasses);
        if (carouselRef.current) {
          carouselRef.current.scrollTo({ left: carouselRef.current.scrollWidth * (page / 3) });
        }
      }

      function updateFadeAnimation(): void {
        const pageClasses: string[] = [];
        for (let i = 0; i < nPages; i++) {
          // need one page to not be absolutely positioned to allow for flex sizing to work
          const pageOffset: number = i - page;
          pageClasses.push(
            classNames(
              pageOffset === 0 ? '' : 'absolute top-0 left-0',
              `transition-opacity duration-700 ease-in opacity-${pageOffset === 0 ? 100 : 0}`
            )
          );
        }
        setCarouselAnimationClass('relative');
        setPageAnimationClasses(pageClasses);
        if (carouselRef.current) carouselRef.current.scroll(0, 0);
      }

      function updateDefaultAnimation(): void {
        setCarouselAnimationClass('');
        setPageAnimationClasses(Array(nPages).fill(''));
        if (carouselRef.current) carouselRef.current.scroll(0, 0);
      }
    },
    // style should be in here in case they override the style in a way that changes the
    //  layout of the carousel, but putting it in causes infinite re-render
    [animation, page, rows, cols, children, className, style]
  );

  const rowsClass: string = rows ? `grid-rows-${rows}` : '';
  const colsClass: string = cols ? `grid-cols-${cols}` : '';
  const gapClass: string = gap !== undefined ? `gap-[${gap}px]` : '';
  const pageGridClass: string = `grid ${rowsClass} ${colsClass} ${gapClass} w-full overflow-visible border-2 border-red-500`;

  const pages: JSX.Element[] = [];
  const childQueue: JSX.Element[] = [...childArray];
  for (let i = 0; i < nPages; i++) {
    const pageItems: JSX.Element[] = [];
    const nItemsInPage = Math.min(nElementsPerPage, childQueue.length);
    for (let j = 0; j < nItemsInPage; j++) {
      const pageItem: JSX.Element = childQueue.shift()!;
      pageItems.push(pageItem);
    }
    // main problem with this approach (one grid per page) means you might have different styling/sizing per page
    pages.push(
      <div
        className={classNames(`${pageGridClass} ${pageAnimationClasses[i]}`, pageClassName)}
        key={`carousel-page-${i}`}
        style={pageStyle || {}}
      >
        {pageItems}
      </div>
    );
  }

  console.log('render');

  return (
    <>
      <div ref={carouselRef} className={`${carouselAnimationClass} max-w-full overflow-visible`} style={style || {}}>
        {pages}
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

Carousel.Item = CarouselItem;

export default Carousel;

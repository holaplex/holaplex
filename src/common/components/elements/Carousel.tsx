import classNames from 'classnames';
import { RefObject, useEffect, useMemo, useRef, useState } from 'react';

//TODO
//  - make progress dots
//  - expose slider visibility
//  - expose slider styling (also allows for setting visibility?)
//  - responsive
//  - get page number based on slider position and update slider position from there
//    so that if the slider is being used, you can click the buttons to re-align to the nearest page
//    in that direction
//  - write tests

interface ItemProps {
  children: JSX.Element | JSX.Element[];
  className?: string;
  style?: object;
}

type AnimationStyle = 'none' | 'slide' | 'fade';

interface CarouselItem {
  (props: ItemProps): JSX.Element;
}

const CarouselItem: CarouselItem = ({ children, className, style = {} }) => (
  <div className={classNames('overflow-visible', className)} style={style}>
    {children}
  </div>
);

interface PageButton {
  (props: { children: JSX.Element; className: string }): JSX.Element;
}

const PageButton: PageButton = ({ children, className }) => (
  <button
    className={classNames(
      'h-10 w-10',
      'rounded-full shadow shadow-current',
      'active:scale-95',
      'flex items-center justify-center',
      className
    )}
  >
    {children}
  </button>
);

const DefaultPageNextElement: JSX.Element = (
  <PageButton className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  </PageButton>
);

const DefaultPagePreviousElement: JSX.Element = (
  <PageButton className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  </PageButton>
);

export interface CarouselProps {
  rows: number;
  cols: number;
  gap?: number;

  /**
   * 'slide' animation cuts off content outside the carousel necessarily (=== no giant box shadows!)
   * because otherwise the content outside the current page
   * would have to be visible, thus defeating the purpose of the carousels
   */
  animation?: AnimationStyle;
  style?: object;
  className?: string;
  pageStyle?: object;
  pageClassName?: string;
  pageNextElement?: JSX.Element;
  pagePreviousElement?: JSX.Element;
  children?: JSX.Element | JSX.Element[];
}

const Carousel = ({
  rows,
  cols,
  gap = 0,
  animation = 'slide',
  style,
  className,
  pageStyle,
  pageClassName,
  pageNextElement: pageRightElement = DefaultPageNextElement,
  pagePreviousElement: pageLeftElement = DefaultPagePreviousElement,
  children = [],
}: CarouselProps): JSX.Element => {
  // ensure 'children' is an array of elements for simpler use, since
  //  we need to spread them across pages
  const childArray: JSX.Element[] = useMemo<JSX.Element[]>(() => {
    if (children === undefined) return [];
    else if (!Array.isArray(children)) return [children];
    else return children;
  }, [children]);

  const nElementsPerPage: number = rows * cols;
  // have at least one page even when there's no children
  const nPages: number = Math.max(1, Math.ceil(childArray.length / nElementsPerPage));

  const [page, setPage] = useState<number>(0);
  const carouselRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

  function updateAnimation(): [string, string[]] {
    switch (animation) {
      case 'slide':
        return updateSlideAnimation();
      case 'fade':
        return updateFadeAnimation();
      default:
        return updateDefaultAnimation();
    }

    function updateSlideAnimation(): [string, string[]] {
      const pageClasses: string[] = [];
      for (let i = 0; i < nPages; i++) {
        pageClasses.push(`flex min-w-full`);
      }
      if (carouselRef.current) {
        carouselRef.current.scrollTo({ left: carouselRef.current.scrollWidth * (page / nPages) });
      }
      return ['flex flex-row flex-nowrap scroll-smooth overflow-hidden', pageClasses];
    }

    function updateFadeAnimation(): [string, string[]] {
      const pageClasses: string[] = [];
      for (let i = 0; i < nPages; i++) {
        // need one page to not be absolutely positioned to allow for flex sizing to work
        pageClasses.push(
          classNames(
            i === page ? '' : 'absolute top-0 left-0 overflow-visible',
            `transition-opacity duration-300 ease-in opacity-${page === i ? 100 : 0}`
          )
        );
      }
      if (carouselRef.current) carouselRef.current.scroll(0, 0);
      return ['relative', pageClasses];
    }

    function updateDefaultAnimation(): [string, string[]] {
      const pageClasses: string[] = [];
      for (let i = 0; i < nPages; i++) {
        // need one page to not be absolutely positioned to allow for flex sizing to work
        pageClasses.push(
          classNames(
            i === page ? '' : 'absolute top-0 left-0 overflow-visible',
            `opacity-${page === i ? 100 : 0}`
          )
        );
      }
      if (carouselRef.current) carouselRef.current.scroll(0, 0);
      return ['relative', pageClasses];
    }
  }

  const [carouselAnimationClass, pageAnimationClasses] = updateAnimation();
  const rowsClass: string = rows ? `grid-rows-${rows}` : '';
  const colsClass: string = cols ? `grid-cols-${cols}` : '';
  const pageGridClass: string = classNames('grid', rowsClass, colsClass);

  // tailwind doesnt support dynamic arbitrary values
  // https://v2.tailwindcss.com/docs/just-in-time-mode#arbitrary-value-support
  const completePageStyle: object = { gap: `${gap}px`, marginRight: `${gap}px` };
  Object.assign(completePageStyle, pageStyle);

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
        className={classNames(
          'w-full overflow-visible',
          pageGridClass,
          pageAnimationClasses[i],
          pageClassName
        )}
        key={`carousel-page-${i}`}
        style={completePageStyle}
      >
        {pageItems}
      </div>
    );
  }

  return (
    <div className="relative overflow-visible">
      <div
        ref={carouselRef}
        className={classNames('max-w-full', carouselAnimationClass, className)}
        style={style}
      >
        {pages}
      </div>
      <div
        onClick={() => setPage(Math.max(0, page - 1))}
        className={classNames({ hidden: page === 0 })}
      >
        {pageLeftElement}
      </div>
      <div
        onClick={() => setPage(Math.min(nPages - 1, page + 1))}
        className={classNames({ hidden: page === nPages - 1 })}
      >
        {pageRightElement}
      </div>
    </div>
  );
};

Carousel.Item = CarouselItem;

export default Carousel;

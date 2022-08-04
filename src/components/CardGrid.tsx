import { DoubleGrid } from '@/assets/icons/DoubleGrid';
import { TripleGrid } from '@/assets/icons/TripleGrid';
import FiltersSection, { FilterProps } from '@/components/Filters';
import clsx from 'clsx';
import { useState, useMemo } from 'react';
import { DebounceInput } from 'react-debounce-input';
import { InView } from 'react-intersection-observer';
import { SearchIcon } from '@heroicons/react/outline';

export interface CardGridWithHeaderProps<T, F> {
  /**
   * Attributes for creating/displaying cards.
   */
  cardContext: CardGridProps<T>['cardContext'];

  /**
   * Attributes for fetching/updating data and triggering more data with infinite scroll.
   */
  dataContext: CardGridProps<T>['dataContext'];

  /**
   * Attributes for the search bar.
   */
  search: SearchBarProps;

  menus?: JSX.Element | JSX.Element[];

  filters?: FilterProps<F>[];
}

/**
 * Grid layout component with triggers for fetching more data for infinite scroll, search bar, and grid size selection.
 *
 * @template T type of data being fetched and used to create cards
 * @template F type for filter options
 * @param props
 * @returns
 */
export function CardGridWithHeader<T, F = null>(props: CardGridWithHeaderProps<T, F>): JSX.Element {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const gridViews = useMemo(() => {
    if (props.filters === undefined) {
      return [GridView.THREE_BY_THREE, GridView.FOUR_BY_FOUR];
    }

    if (collapsed) {
      return [GridView.THREE_BY_THREE, GridView.FOUR_BY_FOUR];
    } else {
      return [GridView.TWO_BY_TWO, GridView.THREE_BY_THREE];
    }
  }, [props.filters, collapsed]);
  const [gridSelected, setGridSelected] = useState<GridToggle>(GridToggle.COMPACT);

  return (
    <div className="w-full space-y-4 text-base">
      <div className="sticky top-0 z-10 flex w-full flex-col items-center gap-6 bg-gray-900 bg-opacity-80 py-4 backdrop-blur-sm lg:flex-row lg:justify-between lg:gap-4">
        <div className={clsx(['flex space-x-4', 'lg:justify-end'], 'w-full px-6', 'md:px-20')}>
          {props.filters && (
            <FiltersSection.FilterIcon
              collapsed={collapsed}
              onClick={() => {
                setCollapsed(!!!collapsed);
              }}
            />
          )}
          <SearchBar {...props.search} />
          {props.menus}
          <GridSelector selected={gridSelected} onChange={setGridSelected} />
        </div>
      </div>
      <div className={clsx('flex justify-center', 'px-6 md:px-20')}>
        {props.filters && (
          <FiltersSection
            collapsed={collapsed}
            className={clsx('mb-10', 'sticky top-[80px] h-full flex-none')}
          >
            {props.filters.map((f) => (
              <FiltersSection.Filter key={f.title} {...f} />
            ))}
          </FiltersSection>
        )}
        <CardGrid
          gridView={gridViews[gridSelected]}
          cardContext={props.cardContext}
          dataContext={props.dataContext}
        />
      </div>
    </div>
  );
}

/**
 * Dimensions of the visible portion of the grid. Name implies rows-by-columns.
 */
enum GridView {
  /**
   * 1x1 (1 card visible at a time)
   */
  ONE_BY_ONE = '1x1',

  /**
   * 2x2 (4 cards visible at a time)
   */
  TWO_BY_TWO = '2x2',

  /**
   * 3x3 (6 cards visible at a time)
   */
  THREE_BY_THREE = '3x3',

  /**
   * 4x4 (16 cards visible at a time)
   */
  FOUR_BY_FOUR = '4x4',
}

// Toggle between grid compact and expanded
enum GridToggle {
  /**
   * grid expand view
   */
  EXPAND = 0,
  /**
   * grid compact view
   */
  COMPACT = 1,
}

interface GridSelectorProps {
  selected: GridToggle;
  onChange: (toggle: GridToggle) => void;
}

function GridSelector(props: GridSelectorProps): JSX.Element {
  return (
    <div className="hidden divide-gray-800 rounded-lg border-2 border-solid border-gray-800 sm:flex">
      <button
        className={clsx('flex w-10 items-center justify-center', {
          'bg-gray-800': props.selected === GridToggle.EXPAND,
        })}
        onClick={() => props.onChange(GridToggle.EXPAND)}
      >
        <DoubleGrid
          className={props.selected === GridToggle.EXPAND ? '' : 'transition hover:scale-110'}
          color={props.selected === GridToggle.EXPAND ? 'white' : '#707070'}
        />
      </button>

      <button
        className={clsx(
          'hidden w-10 items-center justify-center border-l-2 border-gray-800 md:flex',
          {
            'bg-gray-800': props.selected === GridToggle.COMPACT,
          }
        )}
        onClick={() => props.onChange(GridToggle.COMPACT)}
      >
        <TripleGrid
          className={props.selected === GridToggle.COMPACT ? '' : 'transition hover:scale-110'}
          color={props.selected === GridToggle.COMPACT ? 'white' : '#707070'}
        />
      </button>
    </div>
  );
}

export interface SearchBarProps {
  /**
   * Callback each time the value of the search term changes.
   */
  onChange: (value: string) => void;

  /**
   * Time to wait between last keypress and registration of search term.
   */
  debounceTimeout: number;

  /**
   * Minimum number of characters required for a search to register. Defaults to 3.
   */
  minCharacters?: number;

  /**
   * Placeholder string for the search bar to prompt for search.
   */
  placeholder?: string;
}

function SearchBar(props: SearchBarProps): JSX.Element {
  return (
    <div className="relative w-full">
      <DebounceInput
        minLength={props.minCharacters ?? 3}
        debounceTimeout={props.debounceTimeout}
        id="nft-search"
        className="peer w-full rounded-lg border-2 border-solid border-gray-800 bg-transparent pl-10 placeholder-gray-500 focus:border-white focus:placeholder-transparent focus:shadow-none focus:ring-0"
        autoComplete="off"
        autoCorrect="off"
        type="search"
        placeholder={props.placeholder ?? 'Search'}
        onChange={(e) => props.onChange(e.target.value)}
      />
      <SearchIcon
        width={24}
        className="absolute left-2 top-[50%] mt-[-12px] text-gray-800 peer-focus:text-white"
      />
    </div>
  );
}

export interface CardGridHeaderElementProps {
  children: JSX.Element;
  className?: string;
}

function CardGridHeaderElement(props: CardGridHeaderElementProps): JSX.Element {
  return <div className={clsx('flex flex-none', props.className)}>{props.children}</div>;
}

CardGridWithHeader.HeaderElement = CardGridHeaderElement;

export type RefetchFunction = () => void;

/**
 * @template T type of data being fetched and used to create cards
 */
export interface CardGridProps<T> {
  /**
   * Dimensions of the visible portion of the grid.
   */
  gridView: GridView;

  /**
   * Optional classname on the grid container.
   */
  className?: string;

  /**
   * Attributes for creating/displaying cards.
   */
  cardContext: {
    /**
     * Element to use when there are no data. Defaults to an empty `<div/>`.
     */
    noDataFallback?: JSX.Element;

    /**
     * Function to create each card element from the data provided.
     */
    cardCreator: (data: T, refetch: RefetchFunction, loading: boolean) => JSX.Element;

    /**
     * Function to create a each card in a row of loading previews before any data have been fetched.
     */
    loadingCardCreator: () => JSX.Element;
  };
  /**
   * Attributes for fetching/updating data and triggering more data with infinite scroll.
   */
  dataContext: {
    /**
     * Data for all cards to be displayed in the grid. You must pass in the data, but this component
     * will take care of determining when cards should be created and rendered.
     */
    data?: T[];

    /**
     * Function to be used to fetch data again (e.g. Apollo query.refetch).
     */
    refetch: RefetchFunction;

    /**
     * Function to be called when infinite scroll deems it's time to load more data. You should
     * hook this up to a function that will update your data array.
     */
    onLoadMore: (inView: boolean, entry: IntersectionObserverEntry) => Promise<void>;

    /**
     * Are there more data to display (e.g. test for additional data fetched during onLoadMore being empty)?
     */
    hasMore: boolean;

    /**
     * Is data currently being loaded (e.g. Apollog query.loading)
     */
    loading?: boolean;
  };
}

/**
 * Grid layout component with trigger for fetching more data for infinite scroll
 *
 * @template T type of data being fetched and used to create cards
 * @param props
 * @returns
 */
export function CardGrid<T>(props: CardGridProps<T>): JSX.Element {
  const gridId: string = useMemo(() => `grid-${Math.round(Math.random() * 100000)}`, []);

  let gridViewClasses: string;
  let gridCols: number;

  switch (props.gridView) {
    case GridView.ONE_BY_ONE: {
      gridViewClasses = 'md:grid-cols-1';
      gridCols = 1;
      break;
    }
    case GridView.TWO_BY_TWO: {
      gridViewClasses = 'md:grid-cols-1 lg:grid-cols-2';
      gridCols = 2;
      break;
    }

    case GridView.THREE_BY_THREE: {
      gridViewClasses = 'md:grid-cols-2 lg:grid-cols-3';
      gridCols = 3;
      break;
    }

    case GridView.FOUR_BY_FOUR: {
      gridViewClasses = 'md:grid-cols-3 lg:grid-cols-4';
      gridCols = 4;
      break;
    }
  }
  const data = props.dataContext.data || [];

  if (!props.dataContext.loading && data.length === 0) {
    return (
      <div className="w-full pb-8">
        <div className="flex w-full justify-center p-8">{props.cardContext.noDataFallback}</div>
      </div>
    );
  }

  return (
    <div className="w-full pb-8">
      <div
        className={clsx('grid grid-cols-1 gap-6 sm:grid-cols-2', gridViewClasses, props.className)}
      >
        {data.map((e, i) => (
          <div key={`${gridId}-${i}`}>
            {props.cardContext.cardCreator(e, props.dataContext.refetch, false)}
          </div>
        ))}
        {props.dataContext.loading &&
          [...Array(gridCols * gridCols).keys()].map((i) => {
            return (
              <div key={`${gridId}-${i}-loading`}>{props.cardContext.loadingCardCreator()}</div>
            );
          })}
        {!props.dataContext.loading &&
          props.dataContext.hasMore &&
          [...Array(gridCols).keys()].map((i) => {
            const loadingCard = props.cardContext.loadingCardCreator();

            return (
              <div key={`${gridId}-${i}-has-more`}>
                {i === 0 ? (
                  <InView
                    threshold={0.01}
                    onChange={props.dataContext.onLoadMore}
                    className="w-full"
                  >
                    {loadingCard}
                  </InView>
                ) : (
                  loadingCard
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}

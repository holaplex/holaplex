import { DoubleGrid } from '@/assets/icons/DoubleGrid';
import { SingleGrid } from '@/assets/icons/SingleGrid';
import { TripleGrid } from '@/assets/icons/TripleGrid';
import { ApolloQueryResult, OperationVariables } from '@apollo/client';
import classNames from 'classnames';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { DebounceInput } from 'react-debounce-input';
import { InView } from 'react-intersection-observer';
import { TailSpin } from 'react-loader-spinner';

export interface CardGridWithHeaderProps<T> {
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
}

/**
 * Grid layout component with triggers for fetching more data for infinite scroll, search bar, and grid size selection.
 *
 * @template T type of data being fetched and used to create cards
 * @param props
 * @returns
 */
export function CardGridWithHeader<T>(props: CardGridWithHeaderProps<T>): JSX.Element {
  const [gridView, setGridView] = useState<GridView>(DEFAULT_GRID_VIEW);

  return (
    <div className="w-full space-y-4 text-base">
      <div className="sticky top-0 z-10 flex w-full flex-col items-center gap-6 bg-gray-900 bg-opacity-80 py-4 backdrop-blur-sm lg:flex-row lg:justify-between lg:gap-4">
        <div className={classNames(['flex space-x-4', 'lg:justify-end'], 'w-full')}>
          <SearchBar {...props.search} />
          {props.menus}
          <GridSelector onChange={(v) => setGridView(v)} />
        </div>
      </div>
      <CardGrid
        gridView={gridView}
        cardContext={props.cardContext}
        dataContext={props.dataContext}
      />
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
   * 4x4 (16 cards visible at a time)
   */
  FOUR_BY_FOUR = '4x4',
  /**
   * 6x6 (36 cards visible at a time)
   */
  SIX_BY_SIX = '6x6',
}

const DEFAULT_GRID_VIEW: GridView = GridView.SIX_BY_SIX;

interface GridSelectorProps {
  onChange: (view: GridView) => void;
}

function GridSelector(props: GridSelectorProps): JSX.Element {
  const [selected, setSelected] = useState<GridView>(DEFAULT_GRID_VIEW);

  const onSelect: (view: GridView) => void = useCallback(
    (view: GridView) => {
      if (view !== selected) {
        props.onChange(view);
        setSelected(view);
      }
    },
    [props, setSelected]
  );

  return (
    <div className="hidden divide-gray-800 rounded-lg border-2 border-solid border-gray-800 sm:flex">
      <button
        className={classNames(
          'flex w-10 items-center justify-center border-r-2 border-gray-800 md:hidden',
          {
            'bg-gray-800': selected === GridView.ONE_BY_ONE,
          }
        )}
        onClick={() => onSelect(GridView.ONE_BY_ONE)}
      >
        <SingleGrid
          className={selected !== GridView.ONE_BY_ONE ? 'transition hover:scale-110 ' : ''}
          color={selected === GridView.ONE_BY_ONE ? 'white' : '#707070'}
        />
      </button>

      <button
        className={classNames('flex w-10 items-center justify-center', {
          'bg-gray-800': selected === GridView.TWO_BY_TWO,
        })}
        onClick={() => onSelect(GridView.TWO_BY_TWO)}
      >
        <DoubleGrid
          className={selected !== GridView.TWO_BY_TWO ? 'transition hover:scale-110 ' : ''}
          color={selected === GridView.TWO_BY_TWO ? 'white' : '#707070'}
        />
      </button>

      <button
        className={classNames(
          'hidden w-10 items-center justify-center border-l-2 border-gray-800 md:flex',
          {
            'bg-gray-800': selected === GridView.SIX_BY_SIX,
          }
        )}
        onClick={() => onSelect(GridView.SIX_BY_SIX)}
      >
        <TripleGrid
          className={selected !== GridView.SIX_BY_SIX ? 'transition hover:scale-110' : ''}
          color={selected === GridView.SIX_BY_SIX ? 'white' : '#707070'}
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
    <DebounceInput
      minLength={props.minCharacters ?? 3}
      debounceTimeout={props.debounceTimeout}
      id="nft-search"
      autoComplete="off"
      autoCorrect="off"
      className="w-full rounded-lg border-2 border-solid border-gray-800 bg-transparent placeholder-gray-500 focus:border-white focus:placeholder-transparent focus:shadow-none focus:ring-0"
      type="search"
      placeholder={props.placeholder ?? 'Search'}
      onChange={(e) => props.onChange(e.target.value)}
    />
  );
}

export interface CardGridHeaderElementProps {
  children: JSX.Element;
}

function CardGridHeaderElement(props: CardGridHeaderElementProps): JSX.Element {
  return (
    <div className="w-full rounded-lg border-2 border-solid border-gray-800 bg-transparent placeholder-gray-500 focus:border-white focus:placeholder-transparent focus:shadow-none focus:ring-0">
      {props.children}
    </div>
  );
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
   * Attributes for creating/displaying cards.
   */
  cardContext: {
    cardType?: 'PROFILES' | 'NFTS' | 'COLLECTIONS';
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
  const [bodyElements, setBodyElements] = useState<JSX.Element[]>([
    props.cardContext.noDataFallback ?? <></>,
  ]);
  const gridId: string = useMemo(() => `grid-${Math.round(Math.random() * 100000)}`, []);

  let gridViewClasses: string;
  let gridCols: number;
  switch (props.gridView) {
    case GridView.ONE_BY_ONE: {
      gridViewClasses = 'md:grid-cols-2';
      gridCols = 1;
      break;
    }
    case GridView.TWO_BY_TWO: {
      gridViewClasses = 'sm:grid-cols-2';
      gridCols = 2;
      break;
    }

    case GridView.FOUR_BY_FOUR: {
      gridViewClasses = 'md:grid-cols-4';
      gridCols = 4;
      break;
    }
    case GridView.SIX_BY_SIX: {
      gridViewClasses =
        props.cardContext.cardType === 'PROFILES' ? 'md:grid-cols-4' : 'md:grid-cols-6';
      gridCols = 6;
      break;
    }
  }

  // set the body of the grid based on data loading state
  useEffect(() => {
    if (props.dataContext.loading) {
      // loading previews
      setBodyElements(
        Array(gridCols)
          .fill(null)
          .map((_) => props.cardContext.loadingCardCreator())
      );
    } else if (props.dataContext.data === undefined || props.dataContext.data.length === 0) {
      // no-data fallback
      setBodyElements([props.cardContext.noDataFallback ?? <></>]);
    } else {
      // loaded data
      setBodyElements(
        props.dataContext.data.map((cardData) =>
          props.cardContext.cardCreator(
            cardData,
            props.dataContext.refetch,
            props.dataContext.loading === undefined ? true : props.dataContext.loading
          )
        )
      );
    }
  }, [setBodyElements, props, gridCols, gridId]);

  return (
    <>
      <div className={classNames('grid grid-cols-1 gap-6', gridViewClasses)}>
        {bodyElements.map((e, i) => (
          <div key={`${gridId}-${i}`}>{e}</div>
        ))}
      </div>
      {/* infinite scroll display and load-more trigger */}
      <InView threshold={0.1} onChange={props.dataContext.onLoadMore}>
        <div
          className={classNames('my-6 flex w-full items-center justify-center font-bold', {
            hidden:
              !props.dataContext.hasMore ||
              (props.dataContext.data && props.dataContext.data.length === 0),
          })}
        >
          <TailSpin height={50} width={50} color={`grey`} ariaLabel={`loading-nfts`} />
        </div>
      </InView>
    </>
  );
}

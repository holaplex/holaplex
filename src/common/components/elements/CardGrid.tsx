import { ApolloQueryResult, OperationVariables } from '@apollo/client';
import { SearchIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import { useState, useCallback, ChangeEventHandler, ChangeEvent, useEffect, useMemo } from 'react';
import { InView } from 'react-intersection-observer';
import { TailSpin } from 'react-loader-spinner';
import { DoubleGrid } from '../icons/DoubleGrid';
import { SingleGrid } from '../icons/SingleGrid';
import { TripleGrid } from '../icons/TripleGrid';
import TextInput2 from './TextInput2';

export interface CardGridWithSearchAndSize<T> {
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
}

/**
 * Grid layout component with triggers for fetching more data for infinite scroll, search bar, and grid size selection.
 *
 * @template T type of data being fetched and used to create cards
 * @param props
 * @returns
 */
export function CardGridWithSearchAndSize<T>(props: CardGridWithSearchAndSize<T>): JSX.Element {
  const [gridView, setGridView] = useState<GridView>(DEFAULT_GRID_VIEW);

  return (
    <div className="w-full space-y-4">
      <div className="w-fullflex sticky top-0 z-10 flex-col items-center gap-6 bg-gray-900 bg-opacity-80 py-4 backdrop-blur-sm lg:flex-row lg:justify-between lg:gap-4">
        <div className="flex w-full lg:justify-end">
          <SearchBar onChange={(v) => props.search.onChange(v)} />
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
   * 3x3 (9 cards visible at a time)
   */
  THREE_BY_THREE = '3x3',
}

const DEFAULT_GRID_VIEW: GridView = GridView.THREE_BY_THREE;

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
    <div className="ml-4 hidden divide-gray-800 rounded-lg border-2 border-solid border-gray-800 sm:flex">
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
            'bg-gray-800': selected === GridView.THREE_BY_THREE,
          }
        )}
        onClick={() => onSelect(GridView.THREE_BY_THREE)}
      >
        <TripleGrid
          className={selected !== GridView.THREE_BY_THREE ? 'transition hover:scale-110' : ''}
          color={selected === GridView.THREE_BY_THREE ? 'white' : '#707070'}
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
}

function SearchBar(props: SearchBarProps): JSX.Element {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [focused, setFocused] = useState<boolean>(false);

  const onChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
      props.onChange(event.target.value);
    },
    [props, setSearchTerm]
  );

  return (
    <TextInput2
      id="owned-search"
      label="owned search"
      hideLabel
      value={searchTerm}
      onChange={onChange}
      leadingIcon={
        <SearchIcon
          aria-hidden="true"
          className={classNames('h-5 w-5', focused ? 'text-white' : 'text-gray-500')}
        />
      }
      placeholder="Search"
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

export type RefetchFunction = (
  variables?: Partial<OperationVariables> | undefined
) => Promise<ApolloQueryResult<{}>>;

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
    case GridView.THREE_BY_THREE: {
      gridViewClasses = 'md:grid-cols-3';
      gridCols = 3;
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
        <div className={classNames('my-6 flex w-full items-center justify-center font-bold', {'hidden':
          (!props.dataContext.hasMore ||
            (props.dataContext.data && props.dataContext.data.length === 0)) || !props.dataContext.loading
      })}>
          <TailSpin height={50} width={50} color={`grey`} ariaLabel={`loading-nfts`} />
        </div>
      </InView>
    </>
  );
}

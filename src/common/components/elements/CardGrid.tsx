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
  cardContext: CardGridProps<T>['cardContext'];
  dataContext: CardGridProps<T>['dataContext'];
  search: SearchBarProps;
}

export function CardGridWithSearchAndSize<T>(props: CardGridWithSearchAndSize<T>): JSX.Element {
  const [gridView, setGridView] = useState<GridView>(DEFAULT_GRID_VIEW);

  return (
    <div>
      <div className="sticky top-0 z-10 flex flex-col items-center gap-6 bg-gray-900 bg-opacity-80 py-4 backdrop-blur-sm lg:flex-row lg:justify-between lg:gap-4">
        <div className={`flex w-full lg:justify-end`}>
          <SearchBar onChange={(v) => props.search.onChange(v)} />
          <GridSelector onChange={(v) => setGridView(v)} />
        </div>
      </div>
      <CardGrid gridView={gridView} cardContext={props.cardContext} dataContext={props.dataContext} />
    </div>
  );
}

enum GridView {
  ONE_BY_ONE = '1x1',
  TWO_BY_TWO = '2x2',
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
    <div className="ml-4  hidden divide-gray-800 rounded-lg border-2 border-solid border-gray-800 sm:flex">
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

export interface CardGridProps<T> {
  gridView: GridView;
  cardContext: {
    noDataFallback?: JSX.Element;
    cardCreator: (data: T, refetch: RefetchFunction, loading: boolean) => JSX.Element;
    loadingCardCreator: () => JSX.Element;
  };
  dataContext: {
    data?: T[];
    refetch: RefetchFunction;
    onLoadMore: (inView: boolean, entry: IntersectionObserverEntry) => Promise<void>;
    hasMore: boolean;
    loading?: boolean;
  };
}

export function CardGrid<T>(props: CardGridProps<T>): JSX.Element {
  const [bodyElements, setBodyElements] = useState<JSX.Element[]>([props.cardContext.noDataFallback ?? <></>]);
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

  useEffect(() => {
    if (props.dataContext.loading) {
      setBodyElements(Array(gridCols).fill(null).map(_ => props.cardContext.loadingCardCreator()));
    } else if (props.dataContext.data === undefined || props.dataContext.data.length === 0) {
      setBodyElements([props.cardContext.noDataFallback ?? <></>]);
    } else {
      setBodyElements(
        props.dataContext.data.map(cardData =>
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
      <div className={classNames({ hidden: !props.dataContext.hasMore })}>
        <InView threshold={0.1} onChange={props.dataContext.onLoadMore}>
          <div className={`my-6 flex w-full items-center justify-center font-bold`}>
            <TailSpin height={50} width={50} color={`grey`} ariaLabel={`loading-nfts`} />
          </div>
        </InView>
      </div>
    </>
  );
}

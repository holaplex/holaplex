import React from 'react';
import { SingleGrid } from '@/assets/icons/SingleGrid';
import { DoubleGrid } from '@/assets/icons/DoubleGrid';
import { TripleGrid } from '@/assets/icons/TripleGrid';
import cx from 'classnames';

interface GridSelectorProps {
  gridView: string;
  setGridView: (...arg: any) => void;
}

function GridSelector({ gridView, setGridView }: GridSelectorProps) {
  return (
    <div className="ml-4  hidden divide-gray-800 rounded-lg border-2 border-solid border-gray-800 sm:flex">
      <button
        className={cx(
          'flex w-10 items-center justify-center border-r-2 border-gray-800 md:hidden',
          {
            'bg-gray-800': gridView === '1x1',
          }
        )}
        onClick={() => setGridView('1x1')}
      >
        <SingleGrid
          className={gridView !== '1x1' ? 'transition hover:scale-110 ' : ''}
          color={gridView === '1x1' ? 'white' : '#707070'}
        />
      </button>

      <button
        className={cx('flex w-10 items-center justify-center', {
          'bg-gray-800': gridView === '2x2',
        })}
        onClick={() => setGridView('2x2')}
      >
        <DoubleGrid
          className={gridView !== '2x2' ? 'transition hover:scale-110 ' : ''}
          color={gridView === '2x2' ? 'white' : '#707070'}
        />
      </button>

      <button
        className={cx(
          'hidden w-10 items-center justify-center border-l-2 border-gray-800 md:flex',
          {
            'bg-gray-800': gridView === '3x3',
          }
        )}
        onClick={() => setGridView('3x3')}
      >
        <TripleGrid
          className={gridView !== '3x3' ? 'transition hover:scale-110' : ''}
          color={gridView === '3x3' ? 'white' : '#707070'}
        />
      </button>
    </div>
  );
}

export default GridSelector;

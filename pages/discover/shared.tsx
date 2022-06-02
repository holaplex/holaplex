import { ArrowLeftIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import { useState } from 'react';

export interface DiscoverLayoutProps {
  children: JSX.Element | JSX.Element[];
}

export default function DiscoverLayout(props: DiscoverLayoutProps): JSX.Element {
  return <div className="flex flex-row">{props.children}</div>;
}

interface FiltersSectionProps {
  children: JSX.Element | JSX.Element[];
}

function FiltersSection(props: FiltersSectionProps): JSX.Element {
  return (
    <div className="flex flex-col space-y-4">
      <span className={classNames("flex w-full flex-row flex-nowrap items-center justify-between p-4", "text-2xl", 
          'border-b border-b-gray-800')}>
        Filter <ArrowLeftIcon className="h-6 w-6" />
      </span>
      {props.children}
    </div>
  );
}

DiscoverLayout.FiltersSection = FiltersSection;

export interface FilterOption {
  value: any;
  label: string;
  numberOfItems?: number;
}

interface FilterProps {
  title: string;
  options: FilterOption[];
  onChange: (selected: FilterOption) => void;
  default?: FilterOption;
}

function Filter(props: FilterProps): JSX.Element {
  const [showOptions, setShowOptions] = useState<boolean>(true);

  return (
    <fieldset>
      <legend
        className={classNames(
          'flex flex-row flex-nowrap items-center justify-between p-4',
          'text-base',
          'hover:cursor-pointer hover:bg-gray-700 focus:bg-gray-700',
        )}
        onClick={() => setShowOptions(!showOptions)}
      >
        {props.title}{' '}
        <ChevronDownIcon className={classNames('ml-2 h-4 w-4', { hidden: showOptions })} />
        <ChevronUpIcon className={classNames('ml-2 h-4 w-4', { hidden: !showOptions })} />
      </legend>

      {/* to "collapse", wrap the filter options in a div that with overflow hidden and then move the options up */}
      <div className='overflow-hidden'>
        <div className={classNames({"-mt-[100%]": !showOptions}, "duration-300 transition-all")}>
            {props.options.map((o) => makeOption(o, props.title, props.onChange))}
        </div>

      </div>
    </fieldset>
  );

  function makeOption(
    option: FilterOption,
    filterName: string,
    onSelect: (o: FilterOption) => void
  ): JSX.Element {
    const id: string = `filter-${filterName}-${option.value}`;
    return (
      <div
        key={id}
        className={classNames('flex flex-row flex-nowrap items-center space-x-4 p-4', 'w-full')}
      >
        <input
          onChange={() => onSelect(option)}
          className={classNames('h-3 w-3', [
            'appearance-none border-none bg-gray-800 outline outline-1 outline-gray-500',
            'checked:bg-white',
          ])}
          type="radio"
          name={filterName}
          id={id}
        />
        <label htmlFor={id} className={classNames('flex-grow', 'text-base')}>
          {option.label}
        </label>
        <span className={'text-base'}>{option.numberOfItems?.toLocaleString()}</span>
      </div>
    );
  }
}

FiltersSection.Filter = Filter;

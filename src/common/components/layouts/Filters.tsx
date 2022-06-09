import {
  FilterIcon,
  ArrowLeftIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/outline';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';

export interface FiltersSectionProps {
  children: JSX.Element | JSX.Element[];
}

export default function FiltersSection(props: FiltersSectionProps): JSX.Element {
  const [collapsed, setCollapsed] = useState<boolean>(true);

  return (
    <div className={classNames('flex flex-col justify-center', [{ 'basis-[320px]': !collapsed }])}>
      <div title="Show filters">
        <FilterIcon
          className={classNames('mr-2 h-6 w-6', { hidden: !collapsed }, 'hover:cursor-pointer')}
          onClick={() => setCollapsed(false)}
        />
      </div>
      <div className={classNames({ hidden: collapsed }, ['mr-2', 'md:mr-10'])}>
        <div className={classNames('flex flex-col space-y-4')}>
          <span
            className={classNames(
              'flex w-full flex-row flex-nowrap items-center justify-between p-4 space-x-4',
              'border-b border-b-gray-800'
            )}
          >
            <span className="text-2xl">Filters</span>
            <div title="Hide filters">
              <ArrowLeftIcon
                onClick={() => setCollapsed(true)}
                className={classNames('h-6 w-6', { hidden: collapsed }, 'hover:cursor-pointer')}
              />
            </div>
          </span>
          {props.children}
        </div>
      </div>
    </div>
  );
}

export interface FilterOption<T> {
  value: T;
  label: string;
  numberOfItems?: number;
}

export interface FilterProps<T> {
  title: string;
  options: FilterOption<T>[];
  onChange: (selected: FilterOption<T>) => void;
  default?: T;
  queryId?: string;
}

function Filter<T>(props: FilterProps<T>): JSX.Element {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [selection, setSelection] = useState<FilterOption<T> | undefined>(
    props.default === undefined ? undefined : props.options.find((o) => o.value === props.default)
  );

  const onChange: (selected: FilterOption<T>) => void = useCallback(
    (selected) => {
      setSelection(selected);
      if (props.queryId) {
        const queryParams = {...router.query};
        queryParams[`${props.queryId}`] = `${selected.value}`;
        router.push({
          query: queryParams,
       });
      }
      props.onChange(selected);
    },
    [props, router]
  );

  if (new Set(props.options.map((o) => o.value)).size < props.options.length) {
    throw Error('Filter option values must be unique');
  }

  return (
    <fieldset>
      <legend
        className={classNames(
          'flex flex-row flex-nowrap items-center justify-between p-4',
          'text-base',
          'hover:cursor-pointer hover:bg-gray-700 focus:bg-gray-700'
        )}
        onClick={() => setCollapsed(!collapsed)}
      >
        {props.title}{' '}
        <ChevronDownIcon className={classNames('ml-2 h-4 w-4', { hidden: !collapsed })} />
        <ChevronUpIcon className={classNames('ml-2 h-4 w-4', { hidden: collapsed })} />
      </legend>

      {/* to "collapse", wrap the filter options in a div that with overflow hidden and then move the options up */}
      <div className="overflow-hidden">
        <div
          className={classNames({'-translate-y-full': collapsed}, 'transition-all duration-300 ease-in')}
        >
          {props.options.map((o) =>
            makeOption(o, props.title, onChange, o.value === selection?.value)
          )}
        </div>
      </div>
    </fieldset>
  );

  function makeOption<U>(
    option: FilterOption<U>,
    filterName: string,
    onSelect: (o: FilterOption<U>) => void,
    checked: boolean
  ): JSX.Element {
    const id: string = `filter-${filterName}-${option.value}`;
    return (
      <div
        key={id}
        className={classNames(
          'flex flex-row flex-nowrap items-center space-x-4 p-4',
          'w-full',
          'hover:underline'
        )}
      >
        <input
          onChange={() => onSelect(option)}
          className={classNames('h-3 w-3', [
            '!bg-gray-800 !outline !outline-0 !outline-gray-500 !ring-1 !ring-gray-500 !ring-offset-0 !ring-offset-transparent',
            'checked:!bg-white',
          ])}
          type="radio"
          name={filterName}
          id={id}
          checked={checked}
        />
        <label htmlFor={id} className={classNames('flex-grow', 'text-base')}>
          {option.label}
        </label>
        <span className={classNames('text-base')}>{option.numberOfItems?.toLocaleString()}</span>
      </div>
    );
  }
}

FiltersSection.Filter = Filter;

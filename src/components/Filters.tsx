import { useUrlQueryParam } from '@/hooks/useUrlQueryParam';
import {
  FilterIcon,
  ArrowLeftIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/outline';
import classNames from 'classnames';
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
              'flex w-full flex-row flex-nowrap items-center justify-between space-x-4 p-4',
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
  /**
   * Filter title, e.g. the thing being filtered.
   */
  title: string;

  /**
   * Filter options that can be selected.
   */
  options: FilterOption<T>[];

  /**
   * Callback to be fired when the filter selection is changed.
   */
  onChange?: (selected: FilterOption<T>) => void;

  /**
   * Default option value to use; defaults to nothing being selected; the value must match
   * one of the options in the <code>options</code> field.
   */
  default?: T;

  /**
   * Key to use for getting/setting the URL query param in the URL; defaults to no usage in the URL.
   */
  queryId?: string;
}

/**
 * A filter with optional auto-setting/getting from URL params
 *
 * @param props
 * @returns
 */
function Filter<T>(props: FilterProps<T>): JSX.Element {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const urlParam = useUrlQueryParam<T | null>(
    props.queryId ?? '',
    props.default ?? null,
    props.queryId != null
  );

  const onChange: (selected: FilterOption<T>) => void = useCallback(
    (selected) => {
      if (props.queryId) {
        urlParam.set(selected.value);
      }
      if (props.onChange != null) props.onChange(selected);
    },
    [props, urlParam]
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
          className={classNames(
            { '-translate-y-full': collapsed },
            'transition-all duration-300 ease-in'
          )}
        >
          {props.options.map((o) =>
            makeOption(o, props.title, onChange, o.value === urlParam.value)
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

import { useUrlQueryParam } from '@/hooks/useUrlQueryParam';
import { FilterIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import { useCallback, useState } from 'react';

export interface FiltersSectionProps {
  children: JSX.Element | JSX.Element[];
  collapsed: boolean;
  className?: string;
}

export default function FiltersSection(props: FiltersSectionProps): JSX.Element {
  return (
    <div
      className={clsx(
        'flex w-[280px] flex-col justify-start',
        { hidden: props.collapsed },
        props.className
      )}
    >
      <div className="mr-2 md:mr-10">
        <div className={clsx('flex flex-col space-y-4')}>{props.children}</div>
      </div>
    </div>
  );
}

interface FilterIconProps {
  collapsed: boolean;
  onClick: () => void;
}

FiltersSection.FilterIcon = function FilterIconButton(props: FilterIconProps) {
  return (
    <button onClick={props.onClick} className="rounded-lg p-2 transition-transform hover:scale-105">
      <FilterIcon className="w-8 hover:cursor-pointer" />
    </button>
  );
};
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
        className={clsx(
          'flex flex-row flex-nowrap items-center justify-between p-4',
          'text-base',
          'hover:cursor-pointer hover:bg-gray-700 focus:bg-gray-700'
        )}
        onClick={() => setCollapsed(!collapsed)}
      >
        {props.title} <ChevronDownIcon className={clsx('ml-2 h-4 w-4', { hidden: !collapsed })} />
        <ChevronUpIcon className={clsx('ml-2 h-4 w-4', { hidden: collapsed })} />
      </legend>

      {/* to "collapse", wrap the filter options in a div that with overflow hidden and then move the options up */}
      <div className="overflow-hidden">
        <div
          className={clsx(
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
        className={clsx(
          'flex flex-row flex-nowrap items-center space-x-4 p-4',
          'w-full',
          'hover:underline'
        )}
      >
        <input
          onChange={() => onSelect(option)}
          className={clsx('h-3 w-3', [
            '!bg-gray-800 !outline !outline-0 !outline-gray-500 !ring-1 !ring-gray-500 !ring-offset-0 !ring-offset-transparent',
            'checked:!bg-white',
          ])}
          type="radio"
          name={filterName}
          id={id}
          checked={checked}
        />
        <label htmlFor={id} className={clsx('flex-grow', 'cursor-pointer text-base')}>
          {option.label}
        </label>
        <span className={clsx('text-base')}>{option.numberOfItems?.toLocaleString()}</span>
      </div>
    );
  }
}

FiltersSection.Filter = Filter;

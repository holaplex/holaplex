import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/outline';
import clsx from 'clsx';

export interface SelectOption<V> {
  label: string;
  value: V;
}

export interface SelectProps<V> {
  value: SelectOption<V>;
  onChange: (value: SelectOption<V>) => void;
  labelKey?: string;
  options: SelectOption<V>[];
}

export function Select<V>({ value, onChange, options }: SelectProps<V>) {
  const selected = value?.label;

  return (
    <Listbox value={value} onChange={onChange}>
      {({ open }) => (
        <div className="relative w-full">
          <Listbox.Button
            className={clsx(
              'relative flex w-full flex-row items-center justify-between p-2 text-left',
              'cursor-pointer rounded-lg border-2 border-solid border-gray-800 bg-transparent placeholder-gray-500 shadow-md',
              'hover:border-white focus:placeholder-transparent focus:shadow-none focus:outline-none focus:ring-0',
              {
                'border-white': open,
              }
            )}
          >
            {selected}
            {open ? <ChevronUpIcon width={16} /> : <ChevronDownIcon width={16} />}
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-900 py-4 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {options.map((option: SelectOption<V>) => {
                return (
                  <Listbox.Option
                    key={option.value as unknown as string}
                    value={option}
                    as={Fragment}
                  >
                    {({ active, selected }) => (
                      <li
                        className={clsx(
                          'flex cursor-pointer flex-row justify-between p-2',
                          active ? 'bg-gray-800 text-white' : 'bg-gray-900 text-white'
                        )}
                      >
                        {option.label}
                        {selected && <CheckIcon width={16} />}
                      </li>
                    )}
                  </Listbox.Option>
                );
              })}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  );
}

import { Disclosure, Transition } from '@headlessui/react';
import { ChevronRight } from '../icons/ChevronRight';
import cx from 'classnames';

interface Props {
  title: string;
  children: React.ReactNode;
  allowHorizOverflow?: boolean;
  defaultOpen?: boolean;
  amount?: number;
}

function Accordion({ title, children, allowHorizOverflow, defaultOpen, amount, ...props }: Props) {
  return (
    <Disclosure defaultOpen={defaultOpen} {...props}>
      {({ open }) => (
        <>
          <Disclosure.Button
            className={`flex h-[71px] w-full items-center justify-between ${
              open ? `rounded-t-lg` : `rounded-lg`
            } border border-gray-800 p-6`}
          >
            <div className={`flex items-center gap-4`}>
              <p className="m-0"> {title}</p>
              {amount && (
                <div className={`flex h-6 w-6 items-center justify-center rounded-md bg-gray-800`}>
                  {amount}
                </div>
              )}
            </div>

            <ChevronRight
              color="#fff"
              className={cx(
                'transition duration-[300ms] ease-in-out',
                open ? 'rotate-[270deg]' : 'rotate-90'
              )}
            />
          </Disclosure.Button>

          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <div
              className={cx('rounded-b border border-t-0 border-gray-800 p-6', {
                'overflow-x-auto': allowHorizOverflow,
              })}
            >
              <Disclosure.Panel>{children}</Disclosure.Panel>
            </div>
          </Transition>
        </>
      )}
    </Disclosure>
  );
}

export default Accordion;

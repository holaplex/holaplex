import { Disclosure, Transition } from '@headlessui/react';
import { ChevronRight } from '../icons/ChevronRight';
import cx from 'classnames';

interface Props {
  title: string;
  children: React.ReactNode;
  allowHorizOverflow?: boolean;
  defaultOpen?: boolean;
}

function Accordion({ title, children, allowHorizOverflow, defaultOpen, ...props }: Props) {
  return (
    <Disclosure {...props}>
      {({ open }) => (
        <>
          <Disclosure.Button className="flex h-[71px] w-full items-center justify-between rounded-t border border-gray-700 p-6">
            <p className="m-0"> {title}</p>

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
              className={cx('rounded-b border border-t-0 border-gray-700 p-6', {
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

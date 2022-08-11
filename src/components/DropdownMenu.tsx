import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import { useState, useEffect, useCallback } from 'react';
import { isTouchScreenOnly } from 'src/lib/utils';

export interface DropdownMenuProps {
  title: string | JSX.Element;
  children: (typeof Item | JSX.Element)[];
  className?: string;
}

export default function DropdownMenu(props: DropdownMenuProps): JSX.Element {
  const [isTouchAndShowItems, setIsTouchAndShowItems] = useState<boolean>(false);
  const [isTouch, setIsTouch] = useState<boolean>(false);
  const [forceHide, setForceHide] = useState<boolean>(false);

  useEffect(() => {
    setIsTouch(isTouchScreenOnly());
  }, [setIsTouch]);

  const onClickHeader = useCallback(() => {
    if (isTouch) setIsTouchAndShowItems(!isTouchAndShowItems);
  }, [isTouchAndShowItems, isTouch]);

  const onClickHideTemporarily = useCallback(() => {
    setIsTouchAndShowItems(false);
    setForceHide(true);
    setTimeout(() => setForceHide(false), 100);
  }, []);

  let containerDisplayClasses: string | undefined;
  let buttonDisplayBasedTextClasses: string;
  let arrowDownDisplayClasses: string = 'block';

  let itemContainerDisplayClasses: string;
  if (!isTouch) {
    containerDisplayClasses = 'group';
    buttonDisplayBasedTextClasses =
      'text-gray-300 hover:text-white focus:text-white group-hover:text-white group-focus:text-white';
    itemContainerDisplayClasses = forceHide
      ? 'hidden'
      : 'hidden group-hover:block group-focus:block';
  } else if (isTouchAndShowItems) {
    buttonDisplayBasedTextClasses = 'text-white group-focus:text-white';
    arrowDownDisplayClasses = forceHide ? 'block' : 'hidden group-focus:block';
    itemContainerDisplayClasses = forceHide ? 'hidden' : 'block group-focus:block';
  } else {
    buttonDisplayBasedTextClasses = 'text-gray-300 group-focus:text-white';
    itemContainerDisplayClasses = forceHide ? 'hidden' : 'hidden group-focus:block';
  }

  const titleElement: JSX.Element =
    typeof props.title === 'string' ? (
      <span className="whitespace-nowrap align-middle">{props.title}</span>
    ) : (
      props.title
    );

  return (
    <div
      className={clsx('group relative inline-block px-2', containerDisplayClasses, props.className)}
      // setTimeout is a hack to allow the click to propagate to the menu item before closing
      onBlur={() => setTimeout(() => setIsTouchAndShowItems(false), 50)}
    >
      <button
        className={clsx('flex w-full flex-row flex-nowrap items-center justify-between', [
          'text-lg font-medium',
          buttonDisplayBasedTextClasses,
        ])}
        onClick={onClickHeader}
      >
        {titleElement}
        <ChevronDownIcon
          className={clsx('ml-2 h-4 w-4 group-hover:rotate-180', arrowDownDisplayClasses)}
        />
      </button>
      <ul
        className={clsx(
          itemContainerDisplayClasses,
          'w-min-full absolute left-0 z-20 bg-gray-900 py-4',
          'list-none overflow-clip',
          'rounded-b-lg shadow-lg shadow-black'
        )}
      >
        {props.children.map((child, i) => (
          <li onClick={onClickHideTemporarily} key={i}>
            {child}
          </li>
        ))}
      </ul>
    </div>
  );
}

export interface DropdownMenuItemProps {
  onClick?: () => void;
  className?: string;
  children: JSX.Element | JSX.Element[];
}

function Item(props: DropdownMenuItemProps): JSX.Element {
  return (
    <div
      onClick={props.onClick}
      className={clsx(
        'w-full',
        'flex justify-between bg-gray-900 py-2 px-4',
        'hover:cursor-pointer',
        'transition-transform hover:bg-gray-800',
        props.className
      )}
    >
      {props.children}
    </div>
  );
}

DropdownMenu.Item = Item;

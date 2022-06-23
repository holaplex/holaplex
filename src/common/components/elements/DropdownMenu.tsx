import { isTouchScreenOnly } from '@/common/utils';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import { useState, useEffect, useCallback } from 'react';

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
  let arrowDownDisplayClasses: string;
  let arrowUpDisplayClasses: string;
  let itemContainerDisplayClasses: string;
  if (!isTouch) {
    containerDisplayClasses = 'group';
    buttonDisplayBasedTextClasses =
      'text-gray-300 hover:text-white focus:text-white group-hover:text-white group-focus:text-white';
    arrowDownDisplayClasses = forceHide ? 'block' : 'block group-hover:hidden group-focus:hidden';
    arrowUpDisplayClasses = forceHide ? 'hidden' : 'hidden group-hover:block group-focus:block';
    itemContainerDisplayClasses = forceHide
      ? 'hidden'
      : 'hidden group-hover:block group-focus:block';
  } else if (isTouchAndShowItems) {
    buttonDisplayBasedTextClasses = 'text-white group-focus:text-white';
    arrowDownDisplayClasses = forceHide ? 'block' : 'hidden group-focus:block';
    arrowUpDisplayClasses = forceHide ? 'hidden' : 'block group-focus:hidden';
    itemContainerDisplayClasses = forceHide ? 'hidden' : 'block group-focus:block';
  } else {
    buttonDisplayBasedTextClasses = 'text-gray-300 group-focus:text-white';
    arrowDownDisplayClasses = 'block';
    arrowUpDisplayClasses = 'hidden';
    itemContainerDisplayClasses = forceHide ? 'hidden' : 'hidden group-focus:block';
  }

  return (
    <div
      className={classNames('relative inline-block', containerDisplayClasses, props.className)}
      // setTimeout is a hack to allow the click to propagate to the menu item before closing
      onBlur={() => setTimeout(() => setIsTouchAndShowItems(false), 50)}
    >
      <button
        className={classNames('flex flex-row flex-nowrap items-center justify-center', [
          'text-lg font-medium',
          buttonDisplayBasedTextClasses,
        ])}
        onClick={onClickHeader}
      >
        <span className="whitespace-nowrap">{props.title}</span>
        <ChevronDownIcon className={classNames('ml-2 h-4 w-4', arrowDownDisplayClasses)} />
        <ChevronUpIcon className={classNames('ml-2 h-4 w-4', arrowUpDisplayClasses)} />
      </button>

      <ul
        className={classNames(
          itemContainerDisplayClasses,
          'absolute left-1/2 z-20 -translate-x-1/2',
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

export interface ItemProps {
  onClick?: () => void;
  className?: string;
  children: JSX.Element | JSX.Element[];
}

function Item(props: ItemProps): JSX.Element {
  return (
    <div
      onClick={props.onClick}
      className={classNames(
        ['w-full', 'bg-gray-900'],
        ['hover:bg-gray-700 focus:bg-gray-700', 'hover:cursor-pointer'],
        props.className
      )}
    >
      {props.children}
    </div>
  );
}

DropdownMenu.Item = Item;

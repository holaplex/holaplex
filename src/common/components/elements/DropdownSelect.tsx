import { useState } from 'react';
import DropdownMenu from './DropdownMenu';

export interface DropdownSelectProps<T extends JSX.Element | string> {
  children: T[];
  defaultIndex?: number;
  title?: JSX.Element | string;
  onSelect?: (index: number) => void;
}

export default function DropdownSelect<T extends JSX.Element | string>(
  props: DropdownSelectProps<T>
): JSX.Element {
  const [selected, setSelected] = useState<number | null>(null);

  function onSelect(selection: number): void {
    setSelected(selection);
    if (props.onSelect) props.onSelect(selection);
  }

  let title: JSX.Element | string;
  if (props.title) title = props.title;
  else if (selected !== null) title = props.children[selected];
  else if (props.defaultIndex !== undefined) title = props.children[props.defaultIndex];
  else title = 'Select';

  const titleElement: JSX.Element = wrapItem(title);

  return (
    <DropdownMenu title={titleElement}>
      {props.children.map((option, i) => (
        <DropdownMenu.Item key={i} onClick={() => onSelect(i)}>
          {wrapItem(option)}
        </DropdownMenu.Item>
      ))}
    </DropdownMenu>
  );

  function wrapItem(item: JSX.Element | string): JSX.Element {
    return typeof item === 'string' ? (
      <span className="whitespace-nowrap py-2 px-4 align-middle">{item}</span>
    ) : (
      item
    );
  }
}

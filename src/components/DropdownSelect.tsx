import { useMemo, useState } from 'react';
import DropdownMenu from './DropdownMenu';

export interface DropdownSelectProps<T extends JSX.Element | string, V = number> {
  children: T[];
  defaultIndex?: number;
  selectedIndex?: number;
  defaultKey?: V;
  selectedKey?: V;
  title?: JSX.Element | string;
  keys?: V[];
  onSelect?: (key: V, index: number, element: JSX.Element) => void;
}

export default function DropdownSelect<T extends JSX.Element | string, V = number>(
  props: DropdownSelectProps<T, V>
): JSX.Element {
  useMemo(() => {
    if (props.keys !== undefined && props.keys.length !== props.children.length) {
      throw new Error('Number of keys must match number of children.');
    }

    if (props.defaultIndex != null && props.defaultKey != null) {
      throw new Error('Define a default index or key, but not both.');
    }

    if (props.selectedIndex != null && props.selectedKey != null) {
      throw new Error('Define a selected index or key, but not both.');
    }
  }, [props]);

  const [selected, setSelected] = useState<number | null>(null);
  const keys = useMemo<any[]>(
    () => (props.keys !== undefined ? props.keys : Array(props.children.length).map((_, i) => i)),
    [props.keys, props.children.length]
  );

  function onSelect(key: V, selection: number, element: JSX.Element): void {
    setSelected(selection);
    if (props.onSelect) props.onSelect(key, selection, element);
  }

  let title: JSX.Element | string;
  if (props.title) title = props.title;
  else if (props.selectedIndex !== undefined) title = props.children[props.selectedIndex];
  else if (props.selectedKey !== undefined) title = props.children[keys.indexOf(props.selectedKey)];
  else if (selected !== null) title = props.children[selected];
  else if (props.defaultIndex !== undefined) title = props.children[props.defaultIndex];
  else if (props.defaultKey !== undefined) title = props.children[keys.indexOf(props.defaultKey)];
  else title = 'Select';

  const titleElement: JSX.Element = wrapItem(title);

  return (
    <DropdownMenu title={titleElement}>
      {props.children.map((option, i) => {
        const element: JSX.Element = wrapItem(option);
        return (
          <DropdownMenu.Item key={keys[i]} onClick={() => onSelect(keys[i], i, element)}>
            {element}
          </DropdownMenu.Item>
        );
      })}
    </DropdownMenu>
  );

  function wrapItem(item: JSX.Element | string): JSX.Element {
    return typeof item === 'string' ? (
      <span className="whitespace-nowrap align-middle">{item}</span>
    ) : (
      item
    );
  }
}

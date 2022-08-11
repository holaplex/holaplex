import clsx from 'clsx';
import Link from 'next/link';

export interface TabProps {
  url: string;
  selected: boolean;
  title: string;
  icon?: (props: any) => JSX.Element;
}

export default function Tab(props: TabProps): JSX.Element {
  return (
    <Link href={props.url} passHref>
      <a
        className={clsx(
          'flex w-full justify-center border-b py-2.5 text-center text-sm font-medium text-white',
          props.selected ? ' border-white' : 'border-gray-800  text-gray-300 hover:text-white'
        )}
      >
        {props.icon && <props.icon className="mr-4 h-5 w-5" />}
        {props.title}
      </a>
    </Link>
  );
}

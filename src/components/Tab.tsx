import classNames from "classnames";
import Link from "next/link";

export interface TabProps {
  url: string;
  selected: boolean;
  title: string;
}

export default function Tab(props: TabProps): JSX.Element {
  return (
    <Link href={props.url} passHref>
      <a
        className={classNames(
          'w-full  border-b py-2.5 text-center text-sm font-medium text-white ',
          props.selected ? ' border-white' : 'border-gray-800  text-gray-300 hover:text-white'
        )}
      >
        {props.title}
      </a>
    </Link>
  );
}

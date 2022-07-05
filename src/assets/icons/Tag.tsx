import { FC, SVGProps } from 'react';

type TagProps = SVGProps<SVGSVGElement> & {
  color?: string;
};

export const Tag: FC<TagProps> = ({ color = `#fff`, ...props }) => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M6.5 6.5H6.51M20.09 12.91L12.92 20.08C12.7343 20.266 12.5137 20.4135 12.2709 20.5141C12.0281 20.6148 11.7678 20.6666 11.505 20.6666C11.2422 20.6666 10.9819 20.6148 10.7391 20.5141C10.4963 20.4135 10.2757 20.266 10.09 20.08L1.5 11.5V1.5H11.5L20.09 10.09C20.4625 10.4647 20.6716 10.9716 20.6716 11.5C20.6716 12.0284 20.4625 12.5353 20.09 12.91Z"
      stroke="#A8A8A8"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

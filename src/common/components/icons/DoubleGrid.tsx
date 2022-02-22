import { FC, SVGProps } from 'react';

type Props = SVGProps<SVGSVGElement> & {
  color?: string;
};

export const DoubleGrid: FC<Props> = ({ color = '#fff', ...props }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M6.66667 2H2V6.66667H6.66667V2Z" fill={color} />
    <path d="M14 2H9.33333V6.66667H14V2Z" fill={color} />
    <path d="M14 9.33333H9.33333V14H14V9.33333Z" fill={color} />
    <path d="M6.66667 9.33333H2V14H6.66667V9.33333Z" fill={color} />
    <path
      d="M6.66667 2H2V6.66667H6.66667V2Z"
      stroke={color}
      strokeWidth="1.67"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 2H9.33333V6.66667H14V2Z"
      stroke={color}
      strokeWidth="1.67"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 9.33333H9.33333V14H14V9.33333Z"
      stroke={color}
      strokeWidth="1.67"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.66667 9.33333H2V14H6.66667V9.33333Z"
      stroke={color}
      strokeWidth="1.67"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

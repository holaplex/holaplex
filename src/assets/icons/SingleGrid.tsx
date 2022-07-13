import { FC, SVGProps } from 'react';

type Props = SVGProps<SVGSVGElement> & {
  color?: string;
};

export const SingleGrid: FC<Props> = ({ color = '#fff', ...props }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 8 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M6.66667 2H2V6.66667H6.66667V2Z" fill={color} />
    <path
      d="M6.66667 2H2V6.66667H6.66667V2Z"
      stroke={color}
      strokeWidth="1.67"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

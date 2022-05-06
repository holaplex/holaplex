import { FC, SVGProps } from 'react';

type ChevronRightProps = SVGProps<SVGSVGElement> & {
  color?: string;
};

export const ChevronRight: FC<ChevronRightProps> = ({ color, ...props }) => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="m9 18 6-6-6-6"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

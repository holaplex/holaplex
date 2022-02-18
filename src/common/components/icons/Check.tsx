import { FC, SVGProps } from 'react';

type CheckProps = SVGProps<SVGSVGElement> & {
  color: string;
};

export const Check: FC<CheckProps> = ({ color = '##32D583', ...props }) => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M20 6 9 17l-5-5"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

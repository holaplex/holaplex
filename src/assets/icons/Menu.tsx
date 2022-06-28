import { FC, SVGProps } from 'react';

type MenuProps = SVGProps<SVGSVGElement> & {
  color: string;
};

export const Menu: FC<MenuProps> = ({ color, ...props }) => {
  return (
    <svg width={40} height={40} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M11 20h18m-18-6h18M11 26h18"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

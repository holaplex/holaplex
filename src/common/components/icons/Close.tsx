import { FC, SVGProps } from 'react';

type CloseProps = SVGProps<SVGSVGElement> & {
  color: string;
};

export const Close: FC<CloseProps> = ({ color, ...props }) => {
  return (
    <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M18 6 6 18M6 6l12 12"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

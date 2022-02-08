import { FC, SVGProps } from 'react';

type BellProps = SVGProps<SVGSVGElement> & {
  color: string;
};

export const Bell: FC<BellProps> = ({ color = '#fff', ...props }) => (
  <svg width={16} height={20} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M8.001 20c1.088 0 1.978-.923 1.978-2.051H6.024C6.024 19.077 6.904 20 8 20Zm5.933-6.154V8.718c0-3.149-1.622-5.785-4.45-6.482v-.698C9.484.688 8.822 0 8.001 0c-.82 0-1.483.687-1.483 1.538v.698c-2.838.697-4.45 3.323-4.45 6.482v5.128L.794 15.17c-.623.646-.188 1.754.692 1.754h13.022c.88 0 1.325-1.108.702-1.754l-1.275-1.323Z"
      fill={color}
    />
  </svg>
);

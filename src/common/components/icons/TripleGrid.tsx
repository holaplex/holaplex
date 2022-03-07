import { FC, SVGProps } from 'react';

type Props = SVGProps<SVGSVGElement> & {
  color?: string;
};

export const TripleGrid: FC<Props> = ({ color = '#fff', ...props }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M4.59709 6.66675H1.37866V9.77783H4.59709V6.66675Z" fill={color} />
    <path d="M9.65463 6.66675H6.4362V9.77783H9.65463V6.66675Z" fill={color} />
    <path d="M9.65463 11.5556H6.4362V14.6667H9.65463V11.5556Z" fill={color} />
    <path d="M4.59709 11.5556H1.37866V14.6667H4.59709V11.5556Z" fill={color} />
    <path
      d="M4.59709 6.66675H1.37866V9.77783H4.59709V6.66675Z"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.65463 6.66675H6.4362V9.77783H9.65463V6.66675Z"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.65463 11.5556H6.4362V14.6667H9.65463V11.5556Z"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.59709 11.5556H1.37866V14.6667H4.59709V11.5556Z"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M4.59709 1.33325H1.37866V4.44433H4.59709V1.33325Z" fill={color} />
    <path d="M9.65463 1.33325H6.4362V4.44433H9.65463V1.33325Z" fill={color} />
    <path d="M9.65463 6.2221H6.4362V9.33318H9.65463V6.2221Z" fill={color} />
    <path d="M4.59709 6.2221H1.37866V9.33318H4.59709V6.2221Z" fill={color} />
    <path
      d="M4.59709 1.33325H1.37866V4.44433H4.59709V1.33325Z"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.65463 1.33325H6.4362V4.44433H9.65463V1.33325Z"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.65463 6.2221H6.4362V9.33318H9.65463V6.2221Z"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.59709 6.2221H1.37866V9.33318H4.59709V6.2221Z"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M9.56389 1.33325H6.34546V4.44433H9.56389V1.33325Z" fill={color} />
    <path d="M14.6214 1.33325H11.403V4.44433H14.6214V1.33325Z" fill={color} />
    <path d="M14.6214 6.2221H11.403V9.33318H14.6214V6.2221Z" fill={color} />
    <path d="M9.56389 6.2221H6.34546V9.33318H9.56389V6.2221Z" fill={color} />
    <path
      d="M9.56389 1.33325H6.34546V4.44433H9.56389V1.33325Z"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.6214 1.33325H11.403V4.44433H14.6214V1.33325Z"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.6214 6.2221H11.403V9.33318H14.6214V6.2221Z"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.56389 6.2221H6.34546V9.33318H9.56389V6.2221Z"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M9.56389 6.66675H6.34546V9.77783H9.56389V6.66675Z" fill={color} />
    <path d="M14.6214 6.66675H11.403V9.77783H14.6214V6.66675Z" fill={color} />
    <path d="M14.6214 11.5556H11.403V14.6667H14.6214V11.5556Z" fill={color} />
    <path d="M9.56389 11.5556H6.34546V14.6667H9.56389V11.5556Z" fill={color} />
    <path
      d="M9.56389 6.66675H6.34546V9.77783H9.56389V6.66675Z"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.6214 6.66675H11.403V9.77783H14.6214V6.66675Z"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.6214 11.5556H11.403V14.6667H14.6214V11.5556Z"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.56389 11.5556H6.34546V14.6667H9.56389V11.5556Z"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

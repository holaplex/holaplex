import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { FC, HTMLAttributes } from 'react';
import { SolIcon } from './elements/Price';

interface DisplaySOLProps extends HTMLAttributes<HTMLParagraphElement> {
  amount: number;
  iconVariant?: `small` | `large` | `smallB` | `largeB`;
}

const iconVariants = {
  small: <SolIcon className="mr-1 h-3 w-3" stroke={`grey`} />,
  large: <SolIcon className="mr-2 h-5 w-5" stroke={`grey`} />,
  smallB: <SolIcon className="mr-1 h-3 w-3" stroke={`black`} />,
  largeB: <SolIcon className="mr-1 h-5 w-5" stroke={`black`} />,
};

export const DisplaySOL: FC<DisplaySOLProps> = ({
  amount,
  className,
  iconVariant = `large`,
  ...rest
}) =>
  amount ? (
    <b className={` inline-flex items-center ${className}`} {...rest}>
      {iconVariants[iconVariant]} {amount / LAMPORTS_PER_SOL}
    </b>
  ) : null;

export const PriceDisplay = ({
  price,
  title,
  className,
}: {
  price: number;
  title: string;
  className?: string;
}) => {
  return (
    <div className={className}>
      <h3 className={`text-base font-medium text-gray-300`}>{title}</h3>
      <DisplaySOL amount={price} />
    </div>
  );
};

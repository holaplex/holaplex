import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { FC, HTMLAttributes } from 'react';
import { SolIcon } from './elements/Price';

interface DisplaySOLProps extends HTMLAttributes<HTMLParagraphElement> {
  amount: number;
}

export const DisplaySOL: FC<DisplaySOLProps> = ({ amount, className, ...rest }) =>
  amount ? (
    <b className={`text-gr inline-flex items-center ${className}`} {...rest}>
      <SolIcon className="mr-2 h-5 w-5" stroke={`white`} /> {amount / LAMPORTS_PER_SOL}
    </b>
  ) : null;

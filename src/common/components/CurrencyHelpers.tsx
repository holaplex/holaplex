import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { FC, HTMLAttributes } from 'react';
import { SolIcon } from './elements/Price';

interface DisplaySOLProps extends HTMLAttributes<HTMLParagraphElement> {
  amount: number;
}

export const DisplaySOL: FC<DisplaySOLProps> = ({ amount, className, ...rest }) =>
  amount ? (
    <b className={`inline-flex items-center ${className}`} {...rest}>
      <SolIcon className="mr-1 h-3 w-3" stroke="white" /> {amount / LAMPORTS_PER_SOL}
    </b>
  ) : null;

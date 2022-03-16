import { FC } from 'react';
import { Close } from '../icons/Close';

export const FailureToast: FC = ({ children }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center text-white">
        <Close color="#D53232" className="mr-2" />
        <div>{children}</div>
      </div>
    </div>
  );
};

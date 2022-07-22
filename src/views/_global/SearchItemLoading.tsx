import React, { FC } from 'react';
import { TextSkeleton } from '@/components/Skeletons';

interface LoadingSearchItemProps {
  variant?: `square` | `circle`;
}

const LoadingSearchItem: FC<LoadingSearchItemProps> = ({ variant = `square` }) => {
  return (
    <div className={`flex flex-row items-center justify-between p-4`}>
      <div className={`flex flex-row items-center gap-6`}>
        <div
          className={`h-12 w-12 ${
            variant === `circle` ? `rounded-full` : `rounded-lg`
          } animate-pulse bg-gray-800`}
        />
        <TextSkeleton />
      </div>
      <div>
        <TextSkeleton width={36} />
      </div>
    </div>
  );
};

export default LoadingSearchItem;

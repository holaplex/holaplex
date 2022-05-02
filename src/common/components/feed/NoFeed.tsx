import React, { FC } from 'react';
import Button from '../elements/Button';

const NoFeed: FC = () => {
  return (
    <div
      className={`flex w-full flex-col items-center gap-6 rounded-lg border border-dashed border-gray-300 p-4`}
    >
      <h6 className={`text-center text-2xl font-semibold`}>Not following anyone yet</h6>
      <p className={`text-center text-base text-gray-300`}>
        Follow your favorite collectors and creators, or get started by following the top 10
        collectors on Holaplex
      </p>
      <Button>Follow top 10 profiles</Button>
    </div>
  );
};

export default NoFeed;

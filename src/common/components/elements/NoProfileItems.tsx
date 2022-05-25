import Link from 'next/link';
import React, { FC } from 'react';
import Button from './Button';

export type NoProfileVariant = 'collected' | 'created' | 'offers' | 'activity';

interface NoProfileItemsProps {
  variant?: NoProfileVariant;
}

const NoProfileItems: FC<NoProfileItemsProps> = ({ variant = 'collected' }) => {
  switch (variant) {
    case 'collected':
      return (
        <div
          className={`mt-12 flex w-full flex-col rounded-lg border border-gray-800 p-4 text-center`}
        >
          <span className="text-center text-2xl font-semibold">
            {`You haven't collected anything yet`}
          </span>
          <span className="mt-2 text-gray-300 ">{`NFTs you have collected will show up here`}</span>
        </div>
      );
    case 'activity':
      return (
        <div className="mt-12 flex flex-col rounded-lg border border-gray-800 p-4 text-center">
          <span className="text-center text-2xl font-semibold">No activity</span>
          <span className="mt-2 text-gray-300 ">
            Activity associated with this user’s wallet will show up here
          </span>
        </div>
      );
    case 'created':
      return (
        <div
          className={`mt-12 flex flex-col justify-center gap-4 rounded-lg border border-gray-800 p-4 text-center`}
        >
          <span className="text-center text-2xl font-semibold">
            {`You haven't created anything yet`}
          </span>
          <span className="text-gray-300 ">{`NFTs you have created or co-created will show up here`}</span>
          <div>
            <Link href={`/nfts/new`} passHref>
              <Button>Create an NFT</Button>
            </Link>
          </div>
        </div>
      );
    default:
      return (
        <div
          className={`mt-12 flex w-full flex-col rounded-lg border border-gray-800 p-4 text-center`}
        >
          <span className="text-center text-2xl font-semibold">{`No items`}</span>
          <span className="mt-2 text-gray-300 ">{`Nothing to see here...`}</span>
        </div>
      );
  }
};

export default NoProfileItems;

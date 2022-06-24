import Link from 'next/link';
import React from 'react';

interface CollectionCardProps {
  address: string;
  image: string;
  amount?: number;
  name: string;
}

function CollectionProfileCard({ address, image, amount, name }: CollectionCardProps) {
  return (
    <div
      className={`relative flex transform overflow-hidden rounded-lg transition duration-[300ms] hover:scale-[1.02]`}
    >
      <Link href={`/collections/${address}/nfts`} scroll={true} passHref>
        <a target={`_self`} className={`cursor-pointer`}>
          <img
            src={image}
            alt={`${name}-collection`}
            className={`h-[30rem] object-cover opacity-60`}
          />
        </a>
      </Link>
      <div className={`absolute left-4 top-4 flex w-5/12 flex-col gap-6`}>
        <img
          src={image}
          alt={`${name}-collection-mini`}
          className={`aspect-square w-full rounded-lg border-2 border-gray-900`}
        />
        {amount && (
          <div className={`w-full rounded-lg bg-gray-800 p-2 py-3`}>
            <p className={`m-0 text-center text-xs font-medium`}>Collection of {amount}</p>
          </div>
        )}
      </div>
      <div className={`absolute left-0 bottom-0 p-4`}>
        <h4 className={`m-0 text-left text-3xl font-semibold`}>{name}</h4>
      </div>
    </div>
  );
}

export const LoadingCollectionProfileCard = () => {
  return (
    <div className={`relative flex animate-pulse overflow-hidden rounded-lg bg-gray-800 `}>
      <div className={`h-[30rem] animate-pulse bg-gray-800 object-cover opacity-60`} />

      <div className={`absolute left-4 top-4 flex w-5/12 flex-col gap-6`}>
        <div
          className={`aspect-square w-full animate-pulse rounded-lg border-2 border-gray-700 bg-gray-900`}
        />

        <div className={`w-full animate-pulse rounded-lg bg-gray-900 p-2 py-3`}></div>
      </div>
      <div className={`absolute left-0 bottom-0 h-1/6 w-full animate-pulse bg-gray-900 p-4`}></div>
    </div>
  );
};

export default CollectionProfileCard;

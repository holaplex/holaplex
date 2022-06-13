import Link from 'next/link';
import React from 'react';

interface CollectionCardProps {
  address: string;
  image: string;
  amount: number;
  name: string;
}

const CollectionCard = ({ address, image, amount, name }: CollectionCardProps) => {
  return (
    <div className={`relative flex overflow-hidden rounded-lg`}>
      <Link href={`/collections/${address}`} scroll={true} passHref>
        <a target={`_self`} className={`cursor-pointer`}>
          <img src={image} alt={`${name}-collection`} className={`h-96 object-cover opacity-60`} />
        </a>
      </Link>
      <div className={`absolute left-4 top-4 flex w-5/12 flex-col gap-6`}>
        <img
          src={image}
          alt={`${name}-collection-mini`}
          className={`aspect-square w-full rounded-lg border-2 border-gray-900`}
        />
        <div className={`w-full rounded-lg bg-gray-800 p-2 py-3`}>
          <p className={`m-0 text-center text-xs font-medium`}>Collection of {amount}</p>
        </div>
      </div>
      <div className={`absolute left-0 bottom-0 p-4`}>
        <h4 className={`m-0 text-left text-3xl font-semibold`}>{name}</h4>
      </div>
    </div>
  );
};

export default CollectionCard;

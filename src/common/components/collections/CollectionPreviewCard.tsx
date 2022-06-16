import Link from 'next/link';
import React from 'react';

interface CollectionCardProps {
  collectionAddress: string;
  collectionImageUrl: string;
  collectionMintAddress: string;
  collectionName: string;
  collectionItemsCount: number;
}
export default function CollectionPreviewCard(props: CollectionCardProps) {
  return (
    <Link href={`/collections/${props.collectionAddress}/nfts`} passHref>
      <a>
        <div className="relative shadow-2xl hover:scale-105">
          <img src={props.collectionImageUrl} className="h-full w-full backdrop-blur-lg" alt="" />

          <div className="top-0 left-0">
            <img src={props.collectionImageUrl} className=" aspect-square h-40 w-40" alt="" />
            <span className="rounded-lg p-4 text-base backdrop-blur-lg">
              Collection of {props.collectionItemsCount || 'X'}
            </span>
          </div>
          <h4 className="mt-auto">{props.collectionName}</h4>
        </div>
      </a>
    </Link>
  );
}

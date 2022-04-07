import React, { FC, useState } from 'react';
import { LoadingContainer } from './LoadingPlaceholders';
import { Avatar, OverlappingCircles } from '../../../../pages/nfts/[address]';
import { imgOpt } from '../../utils';
import Link from 'next/link';
import { Nft } from '../../../graphql/indexerTypes';

interface NFTPreviewProps {
  loading: boolean;
  nft?: Nft;
}

const NFTPreview: FC<NFTPreviewProps> = ({ loading, nft }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  return (
    <div className={`mt-8 flex w-full justify-start`}>
      <div className={`relative aspect-square h-14 w-14`}>
        {loading ||
          (!imgLoaded && (
            <LoadingContainer className="absolute inset-0 rounded-lg bg-gray-800 shadow " />
          ))}
        {nft?.image && (
          <img
            onLoad={() => setImgLoaded(true)}
            src={imgOpt(nft?.image, 400)}
            alt={`nft-mini-image`}
            className={`block aspect-square w-full rounded-lg border-none object-cover `}
          />
        )}
      </div>
      <div className={`ml-5`}>
        <p className={`mb-0 text-base font-medium`}>{nft?.name}</p>
        <ul className={`mt-2`}>
          {loading ? (
            <></>
          ) : nft?.creators.length === 1 ? (
            <Link href={`/profiles/${nft?.creators[0].address}`}>
              <a>
                <Avatar address={nft?.creators[0].address} />
              </a>
            </Link>
          ) : (
            <div>
              <OverlappingCircles creators={nft?.creators || []} />
            </div>
          )}
        </ul>
      </div>
    </div>
  );
};

export default NFTPreview;

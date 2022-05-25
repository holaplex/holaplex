import React, { FC, useState } from 'react';
import { LoadingContainer } from './LoadingPlaceholders';
import { imgOpt } from '../../utils';
import Link from 'next/link';
import { Nft } from '../../../graphql/indexerTypes';
import { OverlappingAvatarSkeleton, TextSkeleton } from './Skeletons';
import { Avatar, AvatarIcons } from './Avatar';

const LoadingPreview = () => {
  return (
    <div className={`mt-8 flex w-full justify-start`}>
      <div className={`relative aspect-square h-14 w-14`}>
        <LoadingContainer
          className={`block aspect-square w-full rounded-lg border-none object-cover `}
        />
      </div>
      <div className={`ml-5`}>
        <TextSkeleton />
        <ul className={`mt-2`}>
          <OverlappingAvatarSkeleton />
        </ul>
      </div>
    </div>
  );
};

interface NFTPreviewProps {
  loading?: boolean;
  nft?: Nft;
}

const NFTPreview: FC<NFTPreviewProps> = ({ loading = false, nft }) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  if (loading) {
    return <LoadingPreview />;
  }

  return (
    <div className={`mt-8 flex w-full justify-start`}>
      <div className={`relative aspect-square h-14 w-14`}>
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
              <AvatarIcons profiles={nft?.creators || []} />
            </div>
          )}
        </ul>
      </div>
    </div>
  );
};

export default NFTPreview;

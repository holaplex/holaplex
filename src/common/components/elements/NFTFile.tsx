import React, { FC, useState } from 'react';
import { Nft } from '../../../graphql/indexerTypes';
import { imgOpt } from '../../utils';
import { LoadingContainer } from './LoadingPlaceholders';
import NFTImage from './NFTImage';

interface NFTFileProps {
  nft: Nft;
  loading: Boolean;
}

const NFTFile: FC<NFTFileProps> = ({ nft, loading }) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <>
      <script
        async
        type="module"
        src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
      />
      <div className="relative w-full  ">
        {(loading || !imgLoaded) && (
          <LoadingContainer className="absolute inset-0 rounded-lg bg-gray-800 shadow " />
        )}
        {nft?.category === `vr` ? (
          <div className={`block w-full rounded-lg border-none object-cover shadow`}>
            {/* @ts-ignore */}
            <model-viewer
              style={{ width: `100%`, height: `100%` }}
              onLoad={() => setImgLoaded(true)}
              camera-controls
              alt={nft.name}
              src={nft.files.find((file) => file.fileType === `application/octet-stream`)?.uri}
            />
          </div>
        ) : nft?.category === `video` || nft?.category === `audio` ? (
          <video
            onLoadStart={() => setImgLoaded(true)}
            onLoad={() => setImgLoaded(true)}
            className={`block w-full rounded-lg border-none object-cover shadow`}
            playsInline={true}
            autoPlay={true}
            muted={true}
            controls={true}
            controlsList={`nodownload`}
            loop={true}
            poster={imgOpt(nft?.image, 800)!}
            src={nft.files[0].uri}
          />
        ) : (
          nft?.image && (
            <NFTImage
              onLoad={() => setImgLoaded(true)}
              src={imgOpt(nft?.image, 800)!}
              className="block w-full rounded-lg border-none object-cover shadow"
              alt=""
            />
          )
        )}
      </div>
    </>
  );
};

export default NFTFile;

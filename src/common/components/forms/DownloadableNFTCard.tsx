import React, { FC, MutableRefObject, useRef } from 'react';
import Button from '../elements/Button';
//@ts-ignore
import FeatherIcon from 'feather-icons-react';
import * as htmlToImage from 'html-to-image';
import { shortenAddress } from '../../../modules/utils/string';
import { DisplaySOL } from '../CurrencyHelpers';
import { Listing, Nft } from '@holaplex/marketplace-js-sdk';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import Link from 'next/link';
import { Avatar } from '@/common/components/elements/Avatar';

interface DownloadNFTCardProps {
  nft: Nft;
  listing: Listing;
  updatedPrice?: number;
  ref?: MutableRefObject<any>;
}

export const TwitterNFTCard: FC<DownloadNFTCardProps> = ({
  nft,
  listing,
  updatedPrice,
  ref,
}) => {
  return (
    <div
      id={`shareNFTCard`}
      ref={ref}
      className={`relative flex h-56 w-full flex-col justify-between rounded-lg bg-gray-800 p-6`}
    >
      <div className={`absolute right-4 top-4`}>
        <span className={`font-base mb-0 text-sm text-white`}>👋 Holaplex</span>
      </div>
      <div className={`flex border-b-2 border-gray-700 pb-4`}>
        {nft?.image && (
          <img
            src={nft.image}
            alt={`share-nft-image`}
            className={`rounded-lg`}
            height={104}
            width={104}
          />
        )}
        <div className={`ml-4 flex w-full flex-col justify-center`}>
          <h6 className={`font-semi-bold mb-0 text-lg text-white`}>{nft?.name}</h6>
          <div className={`mt-4 flex flex-row items-center`}>
            <Avatar address={nft?.owner?.address as string} showAddress={false} />
            <span className={`mb-0 ml-2 text-xs font-medium text-white`}>
              @{shortenAddress(nft?.owner?.address || '')}
            </span>
          </div>
        </div>
      </div>
      {updatedPrice && (
        <div className={`flex items-center justify-between text-white`}>
          <p className={`mb-0 font-medium`}>New price</p>
          <DisplaySOL
            amount={updatedPrice}
            className={`font-semibold text-white`}
            iconVariant={`large`}
          />
        </div>
      )}
      {!updatedPrice && listing?.price && (
        <div className={`flex items-center justify-between text-white`}>
          <p className={`mb-0 font-medium`}>Price</p>
          <DisplaySOL
            amount={Number(listing.price)}
            className={`font-semibold text-white`}
            iconVariant={`large`}
          />
        </div>
      )}
      {!updatedPrice && !listing?.price && (
        <div className={`flex items-center justify-between text-white`}>
          <p className={`mb-0 font-medium`}>Not listed</p>
          <span>--</span>
        </div>
      )}
    </div>
  );
};

const DownloadNFTCard: FC<DownloadNFTCardProps> = ({
  nft,
  listing,
  updatedPrice,
}) => {
  const downloadRef = useRef(null);
  const downloadSharableImage = async () => {
    if (window) {
      const data = await htmlToImage.toPng(document.getElementById(`shareNFTCard`) as HTMLElement);
      const link = document.createElement('a');
      link.href = data;
      link.download = `${nft.address}-shared.png`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <>
      <TwitterNFTCard
        nft={nft}
        listing={listing}
        updatedPrice={updatedPrice}
        ref={downloadRef}
      />
      <div className={`mt-16`}>
        <div className={`flex w-full justify-between gap-4`}>
          <Button secondary onClick={downloadSharableImage}>
            <span className={`flex items-center gap-4`}>
              <FeatherIcon height={18} width={18} icon={`download`} /> Download card
            </span>
          </Button>
          <div className={`w-full`}>
            <Link
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                `I just updated the price of ${nft?.name} to ${
                  (updatedPrice || 0) / LAMPORTS_PER_SOL
                } SOL`
              )}&hashtags=holaplex&url=${encodeURI(`https://holaplex.com/nfts/${nft.address}`)}`}
            >
              <a target="_blank">
                <Button className={`w-full`}>
                  <span className={`flex items-center gap-4`}>
                    <FeatherIcon height={18} width={18} icon={`twitter`} /> Tweet
                  </span>
                </Button>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default DownloadNFTCard;

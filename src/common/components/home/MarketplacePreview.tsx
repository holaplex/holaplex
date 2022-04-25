import React, { FC, useCallback, useEffect, useState, VFC } from 'react';
import { imgOpt, isTouchScreenOnly } from '../../utils';
import { MarketplacePreviewData } from '@/types/types';
import { SolIcon } from '../elements/Price';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useAnalytics } from '@/common/context/AnalyticsProvider';
import { AvatarIcons } from '../elements/Avatar';
import { useMarketplacePreviewQuery } from 'src/graphql/indexerTypes';

const LoadingPreview = () => {
  return (
    <Container>
      <div className="h-full w-full animate-pulse bg-gray-700" />
    </Container>
  );
};

interface MarketplacePreviewProps {
  subdomain: string;
}

const MarketplacePreview: FC<MarketplacePreviewProps> = ({ subdomain }) => {
  const { track } = useAnalytics();
  
  const [showDetails, setShowDetails] = useState(false);
  useEffect(() => setShowDetails(isTouchScreenOnly()), []);
  const onMouseEnter = useCallback(() => setShowDetails(true), []);
  const onMouseLeave = useCallback(() => setShowDetails(isTouchScreenOnly()), []);

  const marketplaceQuery = useMarketplacePreviewQuery({
    variables: {
      subdomain: subdomain
    },
  });
  let data: MarketplacePreviewData | undefined = marketplaceQuery?.data?.marketplace ? (marketplaceQuery.data.marketplace as MarketplacePreviewData) : undefined;
  const loading: boolean = marketplaceQuery?.loading;

  const onClickMarketplaceLink = useCallback(() => {
    track('Marketplace Selected', {
      event_category: 'Discovery',
      event_label: data ? data.subdomain : "unknown-subdomain",
    });
  }, [data, track]);

  if (loading || !dataAreComplete(data)) {
    return <LoadingPreview />;
  }

  // all required data are available after checking dataAreComplete()
  data = data!;

  const marketplaceUrl: string = `https://${data.subdomain}.holaplex.market`;
  const nftVolumeStr: string = Number.parseInt(data.stats.nfts).toLocaleString();
  const priceSol: number = Number.parseFloat(data.auctionHouse.stats.floor) / LAMPORTS_PER_SOL;

  return (
    <Container onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {/* preview image */}
      <div className="relative h-full w-full">
        <a href={marketplaceUrl} target="_blank" rel="noreferrer" onClick={onClickMarketplaceLink}>
          <img
            src={imgOpt(data.bannerUrl, 600)}
            alt={`${data.name}`}
            className="absolute w-full object-cover"
          />
        </a>

        {/* preview gradient overlay */}
        <div className="pointer-events-none absolute h-full w-full bg-gradient-to-b from-black/20 to-black/70" />
      </div>

      {/* creator icons
            allow pointer events through the container div for clickable preview image while also allowing
            pointer events on the creator icons */}
      <div className="pointer-events-none absolute top-0 left-0 h-full w-full select-none pl-5 pt-5">
        <div className="pointer-events-auto">
          <AvatarIcons
            creators={
              data.creators.map((c) => {
                return { address: c.creatorAddress };
              }) || []
            }
          />
        </div>
      </div>

      {/* marketplace name, NFT volume, and floor price section */}
      <div className="pointer-events-none absolute bottom-0 left-0 flex w-full flex-col p-5">
        <span className="text-xl font-semibold text-white">{data.name}</span>

        {/* NFT volume and floor price row container
                Using height and opacity (rather than 'display') to animate bottom-text appearing */}
        <div
          className={`${
            showDetails ? 'h-8 opacity-100' : 'h-0 opacity-0'
          } flex flex-row items-center justify-between overflow-hidden duration-150`}
        >
          <span className="text-left text-base font-medium">{`${nftVolumeStr} NFTs`}</span>
          <div className="flex flex-row text-right text-base font-medium">
            <span className="mr-3">Floor price:</span>
            <Price priceSol={priceSol} />
          </div>
        </div>
      </div>
    </Container>
  );
};

function dataAreComplete(data?: MarketplacePreviewData): boolean {
  return (
    data != undefined &&
    data.auctionHouse != undefined &&
    data.auctionHouse.stats != undefined &&
    data.auctionHouse.stats.floor != undefined &&
    data.bannerUrl != undefined &&
    data.creators != undefined &&
    data.name != undefined &&
    data.stats != undefined &&
    data.stats.nfts != undefined &&
    data.subdomain != undefined
  );
}

const Price: VFC<{ priceSol: number }> = (props) => {
  const priceString: string = props.priceSol.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
  });
  return (
    <div className="flex flex-nowrap items-center">
      <SolIcon className="mr-1 h-4" stroke="white" /> {priceString}
    </div>
  );
};

const Container: FC<any> = (props) => {
  return (
    <div
      className="relative h-full w-full overflow-clip rounded-lg duration-150 hover:scale-[1.02]"
      {...props}
    />
  );
};

export default MarketplacePreview;

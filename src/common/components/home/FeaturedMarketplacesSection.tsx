import { HomeSection, HomeSectionCarousel } from 'pages/home-v2-wip';
import React, { FC, useCallback, useEffect, useState, VFC } from 'react';
import { imgOpt, isTouchScreenOnly } from '../../utils';
import { MarketplacePreviewData } from '@/types/types';
import { SolIcon } from '../elements/Price';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useAnalytics } from '@/common/context/AnalyticsProvider';
import { AvatarIcons } from '../elements/Avatar';
import { useMarketplacePreviewQuery } from 'src/graphql/indexerTypes';
import { getFallbackImage } from '@/modules/utils/image';

const previewSubdomains: string[] = [
  'junglecats',
  'cityshop',
  'thechimpions',
  'skeletoncrew',
  'monkedao',
  'ursmarket',
  'pixelbands',
  'thislooksrare',
  'shiguardians',
  'mortuary',
  'kurumanft',
  'paragon',
];

const FeaturedMarkeplacesSection: VFC = () => {
  return (
    <HomeSection>
      <HomeSection.Header>
        <HomeSection.Title>Marketplaces</HomeSection.Title>
        <HomeSection.HeaderAction external href="https://marketplace.holaplex.com/waitlist">
          Join waitlist
        </HomeSection.HeaderAction>
      </HomeSection.Header>
      <HomeSection.Body>
        <HomeSectionCarousel cols={3} rows={2}>
        {previewSubdomains.map((s) => (
            <HomeSectionCarousel.Item key={s}>
              <div key={s} className="aspect-[16/10] w-full p-2">
                <MarketplacePreview subdomain={s} />
              </div>
            </HomeSectionCarousel.Item>
          ))}
        </HomeSectionCarousel>
      </HomeSection.Body>
    </HomeSection>
  );
};



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
      subdomain: subdomain,
    },
  });
  let data: MarketplacePreviewData | undefined = marketplaceQuery?.data?.marketplace
    ? (marketplaceQuery.data.marketplace as MarketplacePreviewData)
    : undefined;
  const loading: boolean = marketplaceQuery?.loading;

  const onClickMarketplaceLink = useCallback(() => {
    track('Marketplace Selected', {
      event_category: 'Discovery',
      event_label: data ? data.subdomain : 'unknown-subdomain',
    });
  }, [data, track]);

  if (loading || !dataAreSufficient(data)) {
    return <LoadingPreview />;
  }

  // sufficient data are available after checking dataAreSufficient()
  data = data!;

  const marketplaceUrl: string = `https://${data.subdomain}.holaplex.market`;
  const nftVolumeStr: string = Number.parseInt(data.stats.nfts).toLocaleString();
  const floorPriceSol: number =
    Number.parseFloat(data.auctionHouse.stats?.floor || '0') / LAMPORTS_PER_SOL;

  return (
    <Container onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {/* preview image */}
      <div className="relative flex">
        <a
          href={marketplaceUrl}
          target="_blank"
          rel="noreferrer"
          onClick={onClickMarketplaceLink}
        >
          <img
            src={imgOpt(data.bannerUrl, 800)}
            alt={`${data.name}`}
            className="min-h-full min-w-full object-cover"
            // provide a fallback image in case the banner isnt found
            onError={({currentTarget}) => {
              // null onerror to prevent looping in worst case
              currentTarget.onerror = null;
              currentTarget.src = getFallbackImage();
            }}
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
        <span className="text-sm lg:text-xl font-semibold text-white">{data.name}</span>

        {/* NFT volume and floor price row container
                Using height and opacity (rather than 'display') to animate bottom-text appearing */}
        <div
          className={`${
            showDetails ? 'h-8 opacity-100' : 'h-0 opacity-0'
          } flex flex-row items-center justify-between overflow-hidden duration-150`}
        >
          <span className="text-left text-xs lg:text-base font-medium">{`${nftVolumeStr} NFTs`}</span>
          <div
            className={`${
              floorPriceSol == 0 ? 'hidden' : ''
            } flex flex-row text-right text-xs lg:text-base font-medium`}
          >
            <span className="mr-1 lg:mr-3">Floor price:</span>
            <Price priceSol={floorPriceSol} />
          </div>
        </div>
      </div>
    </Container>
  );
};

function dataAreSufficient(data?: MarketplacePreviewData): boolean {
  return (
    data != undefined &&
    data.auctionHouse != undefined &&
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
      className="relative flex h-full w-full overflow-clip rounded-lg duration-150 hover:scale-[1.02]"
      {...props}
    />
  );
};

export default FeaturedMarkeplacesSection;

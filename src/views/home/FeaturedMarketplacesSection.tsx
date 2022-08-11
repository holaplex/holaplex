import { HomeSection, HomeSectionCarousel } from 'src/pages/index';
import React, { FC, useCallback, useEffect, useMemo, useState, VFC } from 'react';
import { imgOpt, isTouchScreenOnly } from '@/lib/utils';
import { SolIcon } from '@/components/Price';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useAnalytics } from 'src/views/_global/AnalyticsProvider';
import { AvatarIcons, AvatarIconsProps } from '@/components/Avatar';
import { getFallbackImage } from '@/modules/utils/image';
import { QueryContext } from '@/hooks/useApolloQuery';

const CAROUSEL_COLS: number = 3;
const CAROUSEL_ROWS: number = 2;

export type FeaturedMarketplacesData = MarketplacePreviewData[];

export interface FeaturedMarketplacesSectionProps {
  context: QueryContext<FeaturedMarketplacesData>;
}

export function FeaturedMarketplacesSection(props: FeaturedMarketplacesSectionProps): JSX.Element {
  const bodyElements: JSX.Element[] = useMemo(() => {
    if (props.context.loading || !props.context.data) {
      return [...Array(CAROUSEL_COLS * CAROUSEL_ROWS)].map((_, i) => (
        <HomeSectionCarousel.Item key={i} className="p-4">
          <LoadingPreview />
        </HomeSectionCarousel.Item>
      ));
    } else {
      return props.context.data.map((p) => (
        <HomeSectionCarousel.Item key={p.subdomain} className="p-4">
          <MarketplacePreview subdomain={p.subdomain} context={{ ...props.context, data: p }} />
        </HomeSectionCarousel.Item>
      ));
    }
  }, [props.context]);

  if (props.context.error) {
    return <></>;
  }
  return (
    <HomeSection>
      <HomeSection.Header>
        <HomeSection.Title>Marketplaces</HomeSection.Title>
        <HomeSection.HeaderAction external href="https://marketplace.holaplex.com/waitlist">
          Join waitlist
        </HomeSection.HeaderAction>
      </HomeSection.Header>
      <HomeSection.Body>
        <HomeSectionCarousel cols={CAROUSEL_COLS} rows={CAROUSEL_ROWS}>
          {bodyElements}
        </HomeSectionCarousel>
      </HomeSection.Body>
    </HomeSection>
  );
}

const LoadingPreview = () => {
  return (
    <Container>
      <div className="flex h-48 w-full animate-pulse items-end bg-gray-900 shadow-md shadow-black">
        <div className="flex w-full p-4 ">
          <div className="h-6 w-48 rounded-md bg-gray-700" />
        </div>
      </div>
    </Container>
  );
};

export interface MarketplacePreviewData {
  subdomain: string;
  name: string;
  bannerUrl: string;
  creators: {
    address: string;
    profileImageUrl?: string;
    handle?: string;
  }[];
  floorPriceLamports?: number;
  nftCount?: number;
}

interface MarketplacePreviewProps {
  subdomain: string;
  context: QueryContext<MarketplacePreviewData>;
}

function MarketplacePreview(props: MarketplacePreviewProps): JSX.Element {
  const { track } = useAnalytics();

  const [showDetails, setShowDetails] = useState(false);
  useEffect(() => setShowDetails(isTouchScreenOnly()), []);
  const onMouseEnter = useCallback(() => setShowDetails(true), []);
  const onMouseLeave = useCallback(() => setShowDetails(isTouchScreenOnly()), []);

  const onClickMarketplaceLink = useCallback(() => {
    track('Marketplace Selected', {
      event_category: 'Discovery',
      event_label: props.context.data ? props.context.data.subdomain : 'unknown-subdomain',
    });
  }, [props.context.data, track]);

  if (props.context.loading || !props.context.data) {
    return <LoadingPreview />;
  }

  const marketplaceUrl: string = `https://${props.subdomain}.holaplex.market`;
  const nftVolumeStr: string = (props.context.data.nftCount ?? 0).toLocaleString();
  const floorPriceSol: number = (props.context.data.floorPriceLamports ?? 0) / LAMPORTS_PER_SOL;

  return (
    <Container onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {/* preview image */}
      <div className="relative flex h-48">
        <a href={marketplaceUrl} target="_blank" rel="noreferrer" onClick={onClickMarketplaceLink}>
          <img
            src={imgOpt(props.context.data.bannerUrl, 800)}
            alt={`${props.context.data.name}`}
            className="min-h-full min-w-full object-cover"
            // provide a fallback image in case the banner isnt found
            onError={({ currentTarget }) => {
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
            profiles={props.context.data.creators.map(convertCreatorDataToAvatarIconProps) || []}
          />
        </div>
      </div>

      {/* marketplace name, NFT volume, and floor price section */}
      <div className="pointer-events-none absolute bottom-0 left-0 flex w-full flex-col p-5">
        <span className="text-sm font-semibold text-white lg:text-lg">
          {props.context.data.name}
        </span>

        {/* NFT volume and floor price row container
                Using height and opacity (rather than 'display') to animate bottom-text appearing */}
        <div
          className={`${
            showDetails ? 'h-8 opacity-100' : 'h-0 opacity-0'
          } flex flex-row items-center justify-between overflow-hidden duration-150`}
        >
          <span className="text-left text-xs font-medium lg:text-sm">{`${nftVolumeStr} NFTs`}</span>
          <div
            className={`${
              floorPriceSol == 0 ? 'hidden' : ''
            } flex flex-row text-right text-xs font-medium lg:text-sm`}
          >
            <span className="mr-1 lg:mr-3">Floor price</span>
            <Price priceSol={floorPriceSol} />
          </div>
        </div>
      </div>
    </Container>
  );
}

function convertCreatorDataToAvatarIconProps(
  data: MarketplacePreviewData['creators'][0]
): AvatarIconsProps['profiles'][0] {
  // always supply 'data' so that the avatar component doesnt attempt to
  //  retrieve the data itself (it will find nothing since we already know it's not there)
  const result: AvatarIconsProps['profiles'][0] = { address: data.address, data: {} };
  if (data.handle && data.profileImageUrl) {
    result.data!.pfpUrl = data.profileImageUrl;
    result.data!.twitterHandle = data.handle;
  }
  return result;
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
      className="relative flex h-full w-full overflow-clip rounded-lg shadow-md shadow-black duration-300 hover:scale-[1.02]"
      {...props}
    />
  );
};

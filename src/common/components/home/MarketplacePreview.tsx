import React, { FC, useCallback, useEffect, useState, VFC } from 'react';
import { OverlappingCircles } from '../../../../pages/nfts/[address]';
import { imgOpt, isTouchScreenOnly } from '../../utils';
import { LoadingContainer } from '../elements/LoadingPlaceholders';
import { OverlappingAvatarSkeleton, TextSkeleton } from '../elements/Skeletons';
import { MarketplacePreviewData } from '@/types/types';
import { SolIcon } from '../elements/Price';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

//TODO include useAnalytics (see ListingPreview) "Just add the hook and make the event "Marketplace Selected""
// TODO include export for SkeletonMarketplacePreview

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
  
interface MarketplacePreviewProps {
    loading: boolean;
    data?: MarketplacePreviewData;
}
  
const MarketplacePreview: FC<MarketplacePreviewProps> = ({ loading, data }) => {
    const [showDetails, setShowDetails] = useState(false);
    useEffect(() => setShowDetails(isTouchScreenOnly()), []);
    const onMouseEnter = useCallback(() => setShowDetails(true), []);
    const onMouseLeave = useCallback(() => setShowDetails(isTouchScreenOnly()), []);
    
    if (loading || !data || !data.stats || !data.auctionHouse) {
        return <LoadingPreview />;
    }

    const marketplaceUrl: string = `https://${data.subdomain}.holaplex.market`;
    const nftVolumeStr: string = Number.parseInt(data.stats.nfts).toLocaleString();
    const priceSol: number = Number.parseFloat(data.auctionHouse.stats.floor) / LAMPORTS_PER_SOL;

    return (
        <div className="relative w-full h-full rounded-lg hover:scale-[1.02] duration-150" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            
            {/* preview image */}
            <div className="relative h-full w-full overflow-clip rounded-lg">
                <a href={marketplaceUrl} target="_blank" rel="noreferrer">
                    <img 
                        src={imgOpt(data.bannerUrl, 600)}
                        alt={`${data.name}`}
                        className="absolute w-full object-cover"
                    />
                </a>

                {/* preview gradient overlay */}
                <div className="absolute h-full w-full bg-gradient-to-b from-black/20 to-black/70 pointer-events-none"/>
            </div>

            {/* creator icons
            allow pointer events through the container div for clickable preview image while also allowing
            pointer events on the creator icons */}
            <div className="absolute w-full h-full top-0 left-0 pl-5 pt-5 select-none pointer-events-none">
                <div className="pointer-events-auto">
                    <OverlappingCircles creators={data.creators.map(c => {return {address: c.creatorAddress}}) || []} />
                </div>
            </div>

            {/* marketplace name, NFT volume, and floor price section */}
            <div className="flex flex-col absolute bottom-0 left-0 p-5 w-full pointer-events-none">
                <span className="text-white text-xl font-semibold">{data.name}</span>

                {/* NFT volume and floor price row container
                Using height and opacity to animate bottom-text appearing */}
                <div className={`${showDetails ? "h-8 opacity-100" : "h-0 opacity-0"} duration-150 overflow-hidden flex flex-row justify-between items-center`}>
                    <span className="font-medium text-base text-left">{`${nftVolumeStr} NFTs`}</span>
                    <div className="flex flex-row font-medium text-base text-right">
                        <span className="mr-3">Floor price:</span>
                        <Price priceSol={priceSol}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Price: VFC<{priceSol: number}> = props => {
    const priceString: string = props.priceSol.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 3});
    return <div className="flex flex-nowrap items-center">
        <SolIcon className="h-4 mr-1" stroke="white"/> {priceString}
    </div>
}
  
export default MarketplacePreview;
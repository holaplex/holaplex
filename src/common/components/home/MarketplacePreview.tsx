import React, { FC } from 'react';
import { Avatar, OverlappingCircles } from '../../../../pages/nfts/[address]';
import { imgOpt } from '../../utils';
import Link from 'next/link';
import { Marketplace } from '../../../graphql/indexerTypes';
import { LoadingContainer } from '../elements/LoadingPlaceholders';
import { OverlappingAvatarSkeleton, TextSkeleton } from '../elements/Skeletons';

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
    data?: Marketplace;
}
  
const MarketplacePreview: FC<MarketplacePreviewProps> = ({ loading, data }) => {
    if (loading) {
        return <LoadingPreview />;
    }

    return <div className="w-[400px] h-[260px] rounded-lg border border-white">
        <div className="relative h-full w-full overflow-clip rounded-lg">
            <img 
                src={imgOpt(data?.bannerUrl, 400)}
                alt="marketplace-banner"
                className="absolute w-full object-cover"
            />
        </div>
    </div>;

    return (
        <div className={`mt-8 flex w-full justify-start`}>
            <div className={`relative aspect-square h-14 w-14`}>
                {data?.bannerUrl && (
                    <img
                        src={imgOpt(data?.bannerUrl, 400)}
                        alt="marketplace-banner"
                        className={`block aspect-square w-full rounded-lg border-none object-cover `}
                    />
                )}
            </div>
            <div className={`ml-5`}>
                <p className={`mb-0 text-base font-medium`}>{data?.name}</p>
                <ul className={`mt-2`}>
                {loading ? (
                    <></>
                ) : data?.creators?.length === 1 ? (
                    <Link href={`/profiles/${data?.creators[0].creatorAddress}`}>
                    <a>
                        <Avatar address={data?.creators[0].creatorAddress} />
                    </a>
                    </Link>
                ) : (
                    <div>
                        <OverlappingCircles creators={data?.creators?.map(c => {return {address: c.creatorAddress}}) || []} />
                    </div>
                )}
                </ul>
            </div>
        </div>
    );
};
  
  export default MarketplacePreview;
import { FC, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { AnchorButton } from '@/components/elements/Button';
import { Col, Row } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { useActivityPageLazyQuery } from 'src/graphql/indexerTypes';
import { DateTime } from 'luxon';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { useTwitterHandle } from '@/common/hooks/useTwitterHandle';
import { showFirstAndLastFour } from '@/modules/utils/string';
import { mq } from '@/common/styles/MediaQuery';
import { imgOpt, RUST_ISO_UTC_DATE_FORMAT } from '@/common/utils';
import { ChevronRight } from '../icons/ChevronRight';
import { Unpacked } from '@/types/Unpacked';
import Bugsnag from '@bugsnag/js';
import TextInput2 from './TextInput2';
// @ts-ignore
import FeatherIcon from 'feather-icons-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { ActivityType, IFeedItem } from '@/modules/feed/feed.interfaces';
import { ActivityCard } from './ActivityCard';
import { Combobox } from '@headlessui/react';
import { classNames } from './ListingPreview';

const randomBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const ActivityContent = ({ publicKey }: { publicKey: PublicKey | null }) => {
  const { data: twitterHandle } = useTwitterHandle(publicKey);
  const [didPerformInitialLoad, setDidPerformInitialLoad] = useState(false);
  const [activityFilter, setActivityFilter] = useState('');
  const [queryActivityPage, activityPage] = useActivityPageLazyQuery();
  const { publicKey: connectedPubkey } = useWallet();

  useEffect(() => {
    if (!publicKey) return;
    setDidPerformInitialLoad(true);

    try {
      queryActivityPage({
        variables: {
          address: publicKey.toString(),
        },
      });
    } catch (error: any) {
      console.error(error);
      console.log('faield to query activity for pubkey', publicKey.toString());
      Bugsnag.notify(error);
    }
  }, [publicKey, queryActivityPage]);

  const isLoading = !didPerformInitialLoad || activityPage.loading;

  const hasItems = !!activityPage.data?.wallet?.bids.length;

  const bids =
    activityPage.data?.wallet?.bids
      .slice()
      .sort(
        (a, b) =>
          DateTime.fromFormat(b.lastBidTime, RUST_ISO_UTC_DATE_FORMAT).toMillis() -
          DateTime.fromFormat(a.lastBidTime, RUST_ISO_UTC_DATE_FORMAT).toMillis()
      ) || [];

  type MyBids = typeof bids;

  // const getEndedAuctions = (myBids: MyBids) => {
  //   if (!myBids?.length) return [];
  //   const results = myBids.map((myBid) => {
  //     const latestListingBid = myBid.listing?.bids
  //       .slice()
  //       .sort(
  //         (a, b) =>
  //           DateTime.fromFormat(b.lastBidTime, RUST_ISO_UTC_DATE_FORMAT).toMillis() -
  //           DateTime.fromFormat(a.lastBidTime, RUST_ISO_UTC_DATE_FORMAT).toMillis()
  //       )?.[0];
  //     if (!myBid.listing?.ended) {
  //       return null;
  //     }
  //     const didWalletWon = latestListingBid?.bidderAddress === publicKey?.toString();
  //     const closedDate = latestListingBid?.lastBidTime;
  //     return {
  //       ...myBid,
  //       // Add 1 second to these items to pop them over bids that are too close.
  //       lastBidTime: DateTime.fromFormat(myBid.lastBidTime, RUST_ISO_UTC_DATE_FORMAT)
  //         .plus({ seconds: 1 })
  //         .toFormat(RUST_ISO_UTC_DATE_FORMAT),
  //       didWalletWon,
  //       closedDate,
  //     };
  //   });
  //   return results.filter((item) => !!item) as NonNullable<Unpacked<typeof results>>[];
  // };

  const isYou = connectedPubkey?.toBase58() === publicKey?.toBase58();

  const getDisplayName = (twitterHandle?: string, pubKey?: PublicKey | null) => {
    if (isYou) return 'You';

    if (twitterHandle) return twitterHandle;
    if (pubKey) return showFirstAndLastFour(pubKey.toBase58());
    return 'Loading';
  };

  // const items = hasItems
  //   ? [...bids!, ...getEndedAuctions(bids!)]
  //       .slice()
  //       .sort(
  //         (a, b) =>
  //           DateTime.fromFormat(b.lastBidTime, RUST_ISO_UTC_DATE_FORMAT).toMillis() -
  //           DateTime.fromFormat(a.lastBidTime, RUST_ISO_UTC_DATE_FORMAT).toMillis()
  //       )
  //   : [];

  // const filteredItems = items.filter(
  //   ({ listing }) =>
  //     !activityFilter ||
  //     [
  //       listing?.storefront?.subdomain,
  //       listing?.storefront?.title,
  //       listing?.nfts.map((nft) => nft.name),
  //     ]
  //       .flat()
  //       .some((word) => word?.includes(activityFilter))
  // );

  const activityItems =
    bids.reduce((items, bid) => {
      const listing = bid.listing;
      const storefront = bid.listing?.storefront;
      if (!listing || !storefront) return items;

      const nft = bid.listing?.nfts[0];

      const listingEnded = listing.ended;
      const hasHighestBid = listing.bids[0].bidderAddress === bid.bidderAddress;

      const itemBase: Partial<IFeedItem> = {
        id: bid.bidderAddress + bid.listingAddress,
        from: {
          pubkey: bid.bidderAddress,
          // handle // fetch async?
        },
        nft: nft && {
          address: nft.address,
          imageURL: nft.image,
          storeSubdomain: storefront.subdomain,
          name: nft.name,
          listingAddress: listing.address,
          // creator
        },
        misc: {
          bidCancelled: bid.cancelled,
          wonListing: listingEnded && hasHighestBid,
        },
        listing: {
          address: listing.address,
          ended: listing.ended,
        },
        storefront,
      };

      if (listingEnded) {
        const activityType = hasHighestBid ? 'LISTING_WON' : 'LISTING_LOST';
        items.push({
          ...itemBase,
          id: itemBase.id + activityType,
          type: activityType,
          timestamp: listing.bids[0].lastBidTime, // more or less
          to:
            activityType === 'LISTING_LOST'
              ? {
                  pubkey: listing.bids[0].bidderAddress,
                }
              : undefined,
          solAmount: listing.bids[0].lastBidAmount,
        });
      }

      if (listing.bids.length > 1) {
        const fromBidIdx = listing.bids.findIndex((b) => b.bidderAddress === bid.bidderAddress);
        const activityType =
          listing.bids[0].bidderAddress === bid.bidderAddress ? 'OUTBID' : 'WAS_OUTBID';
        const toIdx = activityType === 'OUTBID' ? fromBidIdx + 1 : fromBidIdx - 1;
        items.push({
          ...itemBase,
          id: itemBase.id + activityType,
          type: activityType,
          timestamp: listing.bids[0].lastBidTime, // more or less
          to: {
            pubkey: listing.bids[toIdx].bidderAddress,
          },
          solAmount: listing.bids[activityType === 'OUTBID' ? fromBidIdx : toIdx].lastBidAmount,
        });
      }

      items.push({
        ...itemBase,
        id: itemBase.id + 'BID_MADE',
        solAmount: bid.lastBidAmount,
        type: 'BID_MADE',
        timestamp: bid.lastBidTime,
      });

      return items;
    }, [] as IFeedItem[]) || [];

  return (
    <ActivityContainer>
      <div className="relative flex  flex-1  ">
        <TextInput2
          id="activity-search"
          label="activity search"
          hideLabel
          value={activityFilter}
          onChange={(e) => setActivityFilter(e.target.value)}
          leadingIcon={<FeatherIcon icon="search" aria-hidden="true" />}
          className="h-10 w-full grow rounded-lg border-2 border-solid border-gray-800 bg-transparent pl-10 pr-0 placeholder-gray-500 focus:border-white focus:placeholder-transparent focus:shadow-none focus:ring-0 "
          placeholder="Search"
        />
      </div>
      {/* <div className="flex">
          <button className="mr-2 bg-gray-600 p-2 hover:bg-gray-800">Bids</button>
          <button className="mr-2 bg-gray-600 p-2 hover:bg-gray-800">Unclaimed bids</button>
          <button className="mr-2 bg-gray-600 p-2 hover:bg-gray-800">Wins</button>
          <button className="mr-2 bg-gray-600 p-2 hover:bg-gray-800">Losses</button>
        </div> */}

      <div className="space-y-4">
        {isLoading ? (
          <>
            <LoadingActivitySkeletonBoxSquareShort />
            <LoadingActivitySkeletonBoxCircleLong />
            <LoadingActivitySkeletonBoxSquareShort />
            <LoadingActivitySkeletonBoxCircleLong />
            <LoadingActivitySkeletonBoxSquareShort />
            <LoadingActivitySkeletonBoxCircleLong />
            <LoadingActivitySkeletonBoxSquareShort />
            <LoadingActivitySkeletonBoxCircleLong />
          </>
        ) : activityItems.length ? (
          activityItems.map((item) => <ActivityCard activity={item} key={item.id} />)
        ) : (
          <div className="mt-12 flex flex-col rounded-lg border border-gray-800 p-4">
            <NoActivityTitle>
              No activity
              {/* {!!items.length && !filteredItems.length && ' for this filter'} */}
            </NoActivityTitle>
            <NoActivityText>
              Activity associated with this user’s wallet will show up here
            </NoActivityText>
          </div>
        )}
      </div>
    </ActivityContainer>
  );
};

const LoadingActivitySkeletonBoxSquareShort = () => {
  return (
    <ActivityBoxContainer>
      <CenteredCol>
        <LoadingBox $borderRadius="4px" />
      </CenteredCol>
      <ContentContainer>
        <LoadingLinesContainer>
          <LoadingLine $width="60%" />
          <LoadingLine $width="25%" />
        </LoadingLinesContainer>
      </ContentContainer>
    </ActivityBoxContainer>
  );
};

const LoadingActivitySkeletonBoxCircleLong = () => {
  return (
    <ActivityBoxContainer>
      <CenteredCol>
        <LoadingBox $borderRadius="100%" />
      </CenteredCol>
      <ContentContainer>
        <LoadingLinesContainer>
          <LoadingLine $width="100%" />
          <LoadingLine $width="25%" />
        </LoadingLinesContainer>
      </ContentContainer>
    </ActivityBoxContainer>
  );
};

const LoadingBox = styled.div<{ $borderRadius: '4px' | '100%' }>`
  width: 52px;
  height: 52px;
  background: #707070;
  border-radius: ${({ $borderRadius }) => $borderRadius};
  -webkit-mask: linear-gradient(-60deg, #000 30%, #000a, #000 70%) right/300% 100%;
  animation: shimmer 2.5s infinite;
  @keyframes shimmer {
    100% {
      -webkit-mask-position: left;
    }
  }
`;

const LoadingLinesContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const LoadingLine = styled.div<{ $width: string }>`
  width: ${({ $width }) => $width};
  height: 16px;
  background: #707070;
  border-radius: 4px;
  margin-top: 8px;
  -webkit-mask: linear-gradient(-60deg, #000 30%, #000a, #000 70%) right/400% 100%;
  animation: shimmer 2.5s infinite;
  @keyframes shimmer {
    100% {
      -webkit-mask-position: left;
    }
  }
`;

type ActivityBoxProps = {
  relatedImageUrl: string;
  content: React.ReactElement;
  action: React.ReactElement;
  href: string;
  isPFPImage?: boolean;
};

const ShowOnMobile = styled.div<{ display: string }>`
  display: ${(props) => props.display};
  ${mq('sm')} {
    display: none;
  }
`;

const HideOnMobile = styled.div<{ display: string }>`
  display: none;
  ${mq('sm')} {
    display: ${(props) => props.display};
  }
`;

const ChevronRightContainer = styled.div`
  display: flex;
  align-items: center;
  ${mq('sm')} {
    display: none;
  }
`;

const ActivityButton = styled(AnchorButton)`
  display: none;
  ${mq('sm')} {
    display: inline-flex;
  }
`;

const NoActivityContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const NoActivityTitle = styled.span`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 32px;
  text-align: center;
`;

const NoActivityText = styled.span`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  color: #a8a8a8;
  margin-top: 8px;
  text-align: center;
`;

const ActivityContainer = styled.main`
  flex: 1;
  margin-top: 16px;
  /*
  ${mq('lg')} {
    margin-top: 0px;
    margin-left: 40px;
  }
  ${mq('xl')} {
    margin-left: 80px;
  }*/
`;

const ContentContainer = styled.div`
  flex: 1;
  margin-left: 16px;
  margin-right: 16px;
`;

const CenteredCol = styled(Col)`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ContentCol = styled(CenteredCol)`
  height: 100%;
  justify-content: center;
`;

const ActivityBoxContainer = styled.div`
  display: flex;
  flex: 1;
  padding: 10px;
  border: 1px solid #262626;
  box-sizing: border-box;
  border-radius: 8px;
`;

const NFTImage = styled(Image)<{ $isPFPImage: boolean }>`
  object-fit: contain;
  ${({ $isPFPImage }) =>
    $isPFPImage
      ? css`
          border-radius: 50%;
        `
      : css`
          border-radius: 2px;
        `}
`;

const TimeText = styled.span`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 16px;
  color: #707070;
`;

const ItemText = styled.span`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 16px;
  color: #a8a8a8;
`;

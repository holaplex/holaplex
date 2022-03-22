import { IFeedItem, IProfile } from '@/modules/feed/feed.interfaces';
import { showFirstAndLastFour } from '@/modules/utils/string';
import { useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { SolIcon } from './Price';
import Image from 'next/image';
import classNames from 'classnames';
import { DateTime } from 'luxon';
import { RUST_ISO_UTC_DATE_FORMAT } from '@/common/utils';
import { useTwitterHandle } from '@/common/hooks/useTwitterHandle';

function ActivityCardContent({ activity, isYou }: { activity: IFeedItem; isYou: boolean }) {
  const from = (activity.from || activity.nft?.creator) as IProfile;

  const fromDisplay = isYou ? 'You' : from.handle || showFirstAndLastFour(from.pubkey);
  const toDisplay = activity.to
    ? activity.to.handle || showFirstAndLastFour(activity.to.pubkey)
    : '';
  const creatorDisplay = activity.nft?.creator?.handle || activity.nft?.creator?.pubkey;

  const FromHelper = () => {
    const { data: twitterHandle } = useTwitterHandle(null, from.pubkey);
    return fromDisplay === 'You' ? (
      <span>You</span>
    ) : (
      <a href={from.pubkey}>
        <span className="text-white">{twitterHandle || fromDisplay}</span>{' '}
      </a>
    );
  };

  const ToHelper = () => {
    const { data: twitterHandle } = useTwitterHandle(null, activity.to?.pubkey);
    return activity.to ? (
      <a href={activity.to.pubkey}>
        <span className="text-white">{twitterHandle || toDisplay}</span>
      </a>
    ) : null;
  };

  const CreatorTextHelper = () =>
    creatorDisplay ? (
      <span>
        by <span className="text-white">{creatorDisplay}</span>
      </span>
    ) : null;

  const NftHelper = () => {
    const nft = activity.nft;
    const storefront = activity.storefront;
    if (!nft && !storefront) return null;
    const listingsURL = 'https://' + storefront?.subdomain + '.holaplex.com/listings/';

    if (!nft) {
      return !activity.storefront ? null : (
        <span>
          an NFT from
          <a href={listingsURL}>
            <span className="text-white"> {activity.storefront?.title}</span>
          </a>
        </span>
      );
    }
    const nftURL = listingsURL + nft.listingAddress;
    return (
      <a href={nftURL}>
        <span className="text-white">{nft.name}</span>
      </a>
    );
  };

  const SolTextHelper = () =>
    activity.solAmount ? (
      <b className="inline-flex items-center">
        <SolIcon className="mr-1 h-3 w-3" stroke="white" /> {activity.solAmount / LAMPORTS_PER_SOL}
      </b>
    ) : null;

  switch (activity.type) {
    case 'BID_MADE':
      return (
        <div className="text-gray-300">
          <FromHelper /> placed a bid of <SolTextHelper />
          <CreatorTextHelper /> on <NftHelper />
        </div>
      );
    case 'OUTBID':
      return (
        <div className="text-gray-300">
          <FromHelper /> outbid <ToHelper /> on <NftHelper /> <CreatorTextHelper /> with a bid of{' '}
          <SolTextHelper />
        </div>
      );
    case 'WAS_OUTBID':
      return (
        <div className="text-gray-300">
          <FromHelper /> {fromDisplay === 'You' ? 'were' : 'was'} outbid by <ToHelper /> on{' '}
          <NftHelper /> <CreatorTextHelper /> with a bid of <SolTextHelper />
        </div>
      );

    case 'LISTING_WON':
      return (
        <div className="text-gray-300">
          <FromHelper /> won the auction for <NftHelper /> <CreatorTextHelper /> for{' '}
          <SolTextHelper />
        </div>
      );

    case 'LISTING_LOST':
      return (
        <div className="text-gray-300">
          <FromHelper /> lost the auction for <NftHelper /> to <ToHelper /> for <SolTextHelper />
        </div>
      );
    default:
      return <div>No content for this activity</div>;
  }
}

export function ActivityCard(props: { activity: IFeedItem }) {
  const { publicKey: connectedPubkey } = useWallet();
  const isYou = connectedPubkey?.toBase58() === props.activity.from?.pubkey;
  // const content = generateContent(props.activity);
  const activityThumbnailImageURL =
    props.activity.nft?.imageURL || props.activity.storefront?.logoUrl;
  const thumbnailType = 'DEFAULT'; // 'PFP'
  const actionURL =
    'https://' +
    props.activity.nft?.storeSubdomain +
    '.holaplex.com/listings/' +
    props.activity.nft?.listingAddress;

  const timeOfActivity = DateTime.fromFormat(props.activity.timestamp, RUST_ISO_UTC_DATE_FORMAT);

  return (
    <div className="relative flex flex-wrap items-center  rounded-md border border-gray-800 p-4 font-sans text-base md:flex-nowrap">
      <div
        className={classNames(
          'relative mr-4 flex h-20 w-20  flex-shrink-0 items-center text-gray-300',
          thumbnailType === 'DEFAULT' ? 'rounded-md' : 'rounded-full'
        )}
      >
        {activityThumbnailImageURL && (
          <Image
            className={thumbnailType === 'DEFAULT' ? 'rounded-md' : 'rounded-full'}
            src={activityThumbnailImageURL}
            alt="activity thumbnail"
            layout="fill"
          />
        )}
      </div>
      <div>
        <ActivityCardContent activity={props.activity} isYou={isYou} />
        <div className="mt-2 text-sm text-gray-500">
          {isYou &&
          !props.activity.misc?.wonListing &&
          !props.activity?.misc?.bidCancelled &&
          props.activity.type === 'BID_MADE' ? (
            <div className="flex items-center text-xs font-medium text-white opacity-80">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-1"
              >
                <path
                  d="M8.00016 3.99967V7.99967L10.6668 9.33301M14.6668 7.99967C14.6668 11.6816 11.6821 14.6663 8.00016 14.6663C4.31826 14.6663 1.3335 11.6816 1.3335 7.99967C1.3335 4.31778 4.31826 1.33301 8.00016 1.33301C11.6821 1.33301 14.6668 4.31778 14.6668 7.99967Z"
                  stroke="white"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <span>You have an uncanceled bid from {timeOfActivity.toRelative()}</span>
            </div>
          ) : (
            timeOfActivity.toRelative()
          )}
        </div>
      </div>
      <a
        href={actionURL}
        target="_blank"
        className="ml-auto w-full pt-4 md:w-auto md:pl-4 md:pt-0"
        rel="noreferrer"
      >
        <button className="w-full rounded-full bg-white px-9  py-2 font-sans text-base font-semibold text-gray-900 hover:bg-gray-200  focus:outline-none focus:ring-2 focus:ring-gray-200  focus:ring-offset-2 md:w-auto">
          View
        </button>
      </a>
    </div>
  );
}

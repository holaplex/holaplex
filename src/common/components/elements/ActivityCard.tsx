import { IFeedItem } from '@/modules/feed/feed.interfaces';
import { showFirstAndLastFour } from '@/modules/utils/string';
import { useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { SolIcon } from './Price';
import classNames from 'classnames';
import { DateTime } from 'luxon';
import { imgOpt, RUST_ISO_UTC_DATE_FORMAT } from '@/common/utils';
import { useAnalytics } from '@/common/context/AnalyticsProvider';
import { Button5 } from './Button2';
import { useTwitterHandleFromPubKeyQuery } from 'src/graphql/indexerTypes';

function ActivityCardContent({ activity, isYou }: { activity: IFeedItem; isYou: boolean }) {
  const from = (activity.sourceUser || activity?.nft?.creators?.[0])!;
  const creator = activity?.nft?.creators?.[0] || null;
  const fromDisplay = isYou ? 'You' : from.handle || showFirstAndLastFour(from.address);
  const toDisplay = activity.toUser
    ? activity.toUser.handle || showFirstAndLastFour(activity.toUser.address)
    : '';
  const creatorDisplay = creator?.handle || creator?.address;

  const FromHelper = () => {
    const { data } = useTwitterHandleFromPubKeyQuery({ variables: { pubKey: from.address } });
    const twitterHandle: string | undefined = data?.wallet?.profile?.handle;

    const profileURL = window.location.origin + '/profiles/' + from.address;
    return fromDisplay === 'You' ? (
      <span>You</span>
    ) : (
      <a href={profileURL}>
        <span className="text-white">{twitterHandle || fromDisplay}</span>{' '}
      </a>
    );
  };

  const ToHelper = () => {
    const { data } = useTwitterHandleFromPubKeyQuery({
      variables: { pubKey: activity.toUser?.address },
    });
    const twitterHandle: string | undefined = data?.wallet?.profile?.handle;
    const profileURL = window.location.origin + '/profiles/' + activity.toUser?.address;
    return activity.toUser ? (
      <a href={profileURL}>
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
  const isYou = connectedPubkey?.toBase58() === props.activity.sourceUser?.address;
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

  const { track } = useAnalytics();

  // Activity Selected
  // Pubkey

  function activitySelected() {
    track('Activity Selected', {
      event_category: 'Profile',
      event_label: props.activity.type,
      activityType: props.activity.type,
    });
  }

  return (
    <div className="relative flex flex-wrap items-center  rounded-md border border-gray-800 p-4 font-sans text-base transition-transform duration-300 hover:scale-[1.02] md:flex-nowrap">
      <div className="flex items-center">
        <div
          className={classNames(
            'relative mr-4 flex  h-20 w-20  flex-shrink-0 items-center text-gray-300',
            thumbnailType === 'DEFAULT' ? 'rounded-md' : 'rounded-full'
          )}
        >
          {activityThumbnailImageURL && (
            <img
              className={
                thumbnailType === 'DEFAULT'
                  ? 'aspect-square rounded-md object-cover'
                  : 'aspect-square rounded-full object-cover'
              }
              src={imgOpt(activityThumbnailImageURL, 200)!}
              alt="activity thumbnail"
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
      </div>
      <a
        href={actionURL}
        target="_blank"
        className="ml-auto w-full pt-4 sm:block md:w-auto md:pl-4 md:pt-0"
        rel="noreferrer"
      >
        <Button5 v="ghost" onClick={() => activitySelected()}>
          View
        </Button5>
      </a>
    </div>
  );
}

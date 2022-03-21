import { IFeedItem, IProfile } from '@/modules/feed/feed.interfaces';
import { showFirstAndLastFour } from '@/modules/utils/string';
import { useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { SolIcon } from './Price';
import Image from 'next/image';
import classNames from 'classnames';
import { DateTime } from 'luxon';
import { RUST_ISO_UTC_DATE_FORMAT } from '@/common/utils';

export function generateContent(fi: IFeedItem) {
  const from = (fi.from || fi.nft?.creator) as IProfile;

  const fromDisplay = from.handle || showFirstAndLastFour(from.pubkey);
  const toDisplay = fi.to ? fi.to.handle || showFirstAndLastFour(fi.to.pubkey) : '';
  const creatorDisplay = fi.nft?.creator?.handle || fi.nft?.creator?.pubkey;

  const creatorTextHelper = () => (creatorDisplay ? ` by ${creatorDisplay}` : '');

  switch (fi.type) {
    case 'BID_MADE':
      return (
        `${fromDisplay} placed a bid of SOL${fi.solAmount} on ${fi.nft?.name}` + creatorTextHelper()
      );
    case 'OUTBID':
      return (
        `${fromDisplay} outbid ${toDisplay} on ${fi.nft?.name}` +
        creatorTextHelper() +
        ` with a bid of SOL${fi.solAmount}`
      );
    case 'WAS_OUTBID':
      return (
        `${fromDisplay} was outbid by ${toDisplay} on ${fi.nft?.name}` +
        creatorTextHelper() +
        ` with a bid of SOL${fi.solAmount}`
      );
    case 'LISTING_WON':
      return (
        `${fromDisplay} won the auction for ${fi.nft?.name}` +
        creatorTextHelper() +
        ` for SOL${fi.solAmount}`
      );

    case 'LISTING_LOST':
      return (
        `${fromDisplay} lost the auction for ${fi.nft?.name}` +
        creatorTextHelper() +
        ` for SOL${fi.solAmount}`
      );

    // return (
    //   <>
    //     <b>{fromDisplay}</b> lost&nbsp;
    //     <b>{fi.nft?.name  bid.listing?.nfts?.[0]?.name}</b>
    //     &nbsp;by <b>{bid.listing?.storefront?.title}</b>
    //   </>
    // );
    default:
      return 'No content for this activity';
  }
}

function ActivityCardContent({ activity }: { activity: IFeedItem }) {
  const { publicKey: connectedPubkey } = useWallet();
  const from = (activity.from || activity.nft?.creator) as IProfile;

  const fromDisplay =
    connectedPubkey?.toBase58() === from.pubkey
      ? 'You'
      : from.handle || showFirstAndLastFour(from.pubkey);
  const toDisplay = activity.to
    ? activity.to.handle || showFirstAndLastFour(activity.to.pubkey)
    : '';
  const creatorDisplay = activity.nft?.creator?.handle || activity.nft?.creator?.pubkey;

  const FromHelper = () =>
    fromDisplay === 'You' ? (
      <span>You</span>
    ) : (
      <a href={from.pubkey}>
        <span className="text-white">{fromDisplay}</span>{' '}
      </a>
    );

  const ToHelper = () =>
    activity.to ? (
      <a href={activity.to.pubkey}>
        <span className="text-white">{toDisplay}</span>
      </a>
    ) : null;

  const CreatorTextHelper = () =>
    creatorDisplay ? (
      <span>
        by <span className="text-white">{creatorDisplay}</span>
      </span>
    ) : null;

  const NftHelper = () => {
    const nft = activity.nft;
    if (!nft) return null;
    const nftURL = 'https://' + nft.storeSubdomain + '.holaplex.com/listings/' + nft.listingAddress;
    return (
      <a href={nftURL}>
        <span className="text-white">{nft.name}</span>
      </a>
    );
  };

  const SolTextHelper = () =>
    activity.solAmount ? (
      <b className="inline-flex items-center">
        <SolIcon className=" mr-1 h-4 w-4 " stroke="white" />{' '}
        {activity.solAmount / LAMPORTS_PER_SOL}
      </b>
    ) : null;

  switch (activity.type) {
    case 'BID_MADE':
      return (
        <>
          <FromHelper /> placed a bid of <SolTextHelper />
          <CreatorTextHelper /> on <NftHelper />
        </>
      );
    case 'OUTBID':
      return (
        <>
          <FromHelper /> outbid <ToHelper /> on <NftHelper /> <CreatorTextHelper /> with a bid of{' '}
          <SolTextHelper />
        </>
      );
    case 'WAS_OUTBID':
      return (
        <>
          <FromHelper /> was outbid by <ToHelper /> on <NftHelper /> <CreatorTextHelper /> with a
          bid of <SolTextHelper />
        </>
      );

    case 'LISTING_WON':
      return (
        <>
          <FromHelper /> won the auction for <NftHelper /> <CreatorTextHelper /> for{' '}
          <SolTextHelper />
        </>
      );

    case 'LISTING_LOST':
      return (
        <>
          <FromHelper /> lost the auction for <NftHelper />
          {/* for <SolTextHelper /> */}
          to <ToHelper />
        </>
      );
    default:
      return <div>No content for this activity</div>;
  }
}

export function ActivityCard(props: { activity: IFeedItem }) {
  // const content = generateContent(props.activity);
  const activityThumbnailImageURL = props.activity.nft?.imageURL;
  const thumbnailType = 'DEFAULT'; // 'PFP'
  const actionURL =
    'https://' +
    props.activity.nft?.storeSubdomain +
    '.holaplex.com/listings/' +
    props.activity.nft?.listingAddress;

  return (
    <div className="relative flex items-center rounded-md border border-gray-800 p-4 font-sans text-base">
      <div
        className={classNames(
          'relative mr-4 h-14 w-14 items-center  text-gray-300',
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
        <ActivityCardContent activity={props.activity} />
        <div className="mt-2 text-sm text-gray-500">
          {DateTime.fromFormat(props.activity.timestamp, RUST_ISO_UTC_DATE_FORMAT).toRelative()}
        </div>
      </div>
      <a href={actionURL} target="_blank" className="ml-auto" rel="noreferrer">
        <button className="font-base  rounded-full bg-white px-9 py-2 font-bold text-gray-900 ">
          View
        </button>
      </a>
    </div>
  );
}

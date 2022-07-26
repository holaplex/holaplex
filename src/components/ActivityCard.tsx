import { IActivityItem } from '@/views/alpha/activity.interfaces';
import { showFirstAndLastFour } from '@/modules/utils/string';
import { useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { SolIcon } from './Price';
import classNames from 'classnames';
import { DateTime } from 'luxon';
import { imgOpt, RUST_ISO_UTC_DATE_FORMAT } from 'src/lib/utils';
import { useAnalytics } from 'src/views/_global/AnalyticsProvider';
import { Button5 } from './Button2';
import { useTwitterHandleFromPubKeyQuery } from 'src/graphql/indexerTypes';

function ActivityCardContent({ activity, isYou }: { activity: IActivityItem; isYou: boolean }) {
  const from = (activity.wallets[0] || activity?.nft?.creators?.[0])!;
  const creator = activity?.nft?.creators?.[0] || null;
  const fromDisplay = isYou ? 'You' : from.twitterHandle || showFirstAndLastFour(from.address);
  const toDisplay = activity.wallets[1]
    ? activity.wallets[1].twitterHandle || showFirstAndLastFour(activity.wallets[1].address)
    : '';
  const creatorDisplay = creator?.twitterHandle || creator?.address;

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
      variables: { pubKey: activity.wallets[1]?.address },
    });
    const twitterHandle: string | undefined = data?.wallet?.profile?.handle;
    const profileURL = window.location.origin + '/profiles/' + activity.wallets[1]?.address;
    return activity.wallets[1] ? (
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
    //const storefront = activity.storefront;
    if (!nft) return null;

    const nftURL = 'https://www.holaplex.com/nfts' + nft.address;
    return (
      <a href={nftURL}>
        <span className="text-white">{nft.name}</span>
      </a>
    );
  };

  const SolTextHelper = () =>
    activity.price ? (
      <b className="inline-flex items-center">
        <SolIcon className="mr-1 h-3 w-3" stroke="white" /> {activity.price / LAMPORTS_PER_SOL}
      </b>
    ) : null;

  switch (activity.activityType) {
    case 'offer':
      return (
        <div className="text-gray-300">
          <FromHelper /> placed a bid of <SolTextHelper />
          <CreatorTextHelper /> on <NftHelper />
        </div>
      );
    case 'listing':
      return (
        <div className="text-gray-300">
          <FromHelper /> listed <NftHelper /> for <SolTextHelper />
        </div>
      );
    case 'purchase':
      return (
        <div className="text-gray-300">
          <ToHelper /> purchased <NftHelper /> for <SolTextHelper /> from <FromHelper />
        </div>
      );
    case 'sell':
      return (
        <div className="text-gray-300">
          <FromHelper /> sold <NftHelper /> for <SolTextHelper /> to <ToHelper />
        </div>
      );
    default:
      return <div>No content for this activity</div>;
  }
}

export function ActivityCard(props: { activity: IActivityItem }) {
  const { publicKey: connectedPubkey } = useWallet();
  const isYou = connectedPubkey?.toBase58() === props.activity.wallets[0]?.address;
  // const content = generateContent(props.activity);
  const activityThumbnailImageURL = props.activity.nft?.image;
  const thumbnailType = 'DEFAULT'; // 'PFP'
  const actionURL = 'https://holaplex.com/nfts/' + props.activity.nft?.address;

  const timeOfActivity = DateTime.fromFormat(props.activity.createdAt, RUST_ISO_UTC_DATE_FORMAT);

  const { track } = useAnalytics();

  // Activity Selected
  // Pubkey

  function activitySelected() {
    track('Activity Selected', {
      event_category: 'Profile',
      event_label: props.activity.activityType,
      activityType: props.activity.activityType,
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

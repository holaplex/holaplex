import ReactDom from 'react-dom';

import { HOLAPLEX_MARKETPLACE_SUBDOMAIN } from '@/common/constants/marketplace';
import { getPFPFromPublicKey } from '@/modules/utils/image';
import { shortenAddress } from '@/modules/utils/string';
import { Marketplace } from '@holaplex/marketplace-js-sdk';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import classNames from 'classnames';
import { DateTime } from 'luxon';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  ListingEvent,
  Nft,
  useNftMarketplaceLazyQuery,
  useTwitterHandleFromPubKeyLazyQuery,
  useWalletProfileLazyQuery,
} from 'src/graphql/indexerTypes';
import { Button5 } from '../elements/Button2';
import { FollowUnfollowButton } from '../elements/FollowUnfollowButton';
import Modal from '../elements/Modal';
import MoreDropdown from '../elements/MoreDropdown';
import NFTPreview from '../elements/NFTPreview';
import OfferForm from '../forms/OfferForm';
import {
  AggregateEvent,
  aggregateEventsTime,
  FeedCardAttributes,
  FeedItem,
  FeedQueryEvent,
  generateFeedCardAttributes,
  User,
} from './feed.utils';
import BuyForm from '../forms/BuyForm';
import { TailSpin } from 'react-loader-spinner';
import { useAnalytics } from '@/common/context/AnalyticsProvider';
import { LoadingContainer } from '../elements/LoadingPlaceholders';
import { imgOpt } from '@/common/utils';
import Carousel from 'react-grid-carousel';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';

interface FeedCardOptions {
  hideAction?: boolean;
}

export function FeedCard(props: {
  event: FeedItem;
  myFollowingList?: string[];
  className?: string;
  allEventsRef?: FeedItem[];
  options?: FeedCardOptions;
}) {
  const { track } = useAnalytics();

  const [imgLoaded, setImgLoaded] = useState(false);

  console.log(props.event.feedEventId);
  if (props.event.__typename === 'AggregateEvent') {
    return <FollowAggregateCard event={props.event} myFollowingList={props.myFollowingList} />;
  }

  const attrs = generateFeedCardAttributes(props.event, props.myFollowingList);
  // console.log('Feed card', props.event.feedEventId, {
  //   event: props.event,
  //   attrs,
  // });

  if (!attrs) return <div>Can not describe {props.event.__typename} </div>;

  if (props.event.__typename === 'FollowEvent') {
    return <FollowCard attrs={attrs} event={props.event} myFollowingList={props.myFollowingList} />;
  }

  const isDev = false;
  if (!attrs.nft)
    return isDev ? (
      <div className="flex flex-wrap items-center rounded-lg bg-gray-900 p-4 shadow-2xl shadow-black ">
        {props.event.__typename} is malformed
        <pre>{JSON.stringify(props.event, null, 2)}</pre>
      </div>
    ) : null;

  return (
    <div
      id={props.event.feedEventId}
      className={classNames('group relative transition-all  hover:scale-[1.02] ', props.className)}
    >
      <Link href={'/nfts/' + attrs.nft.address} passHref>
        <a>
          {false && (
            // removed for now to work with new hero section. Add it and the hero feed has massive flickering on load
            // !imgLoaded
            <LoadingContainer className=" aspect-square w-full rounded-lg bg-gray-800 shadow " />
          )}

          {attrs.nft?.category === `video` || attrs.nft?.category === `audio` ? (
            <video
              onLoadStart={() => setImgLoaded(true)}
              onLoad={() => setImgLoaded(true)}
              className={`block aspect-square w-full rounded-lg border-none object-cover shadow`}
              playsInline={true}
              autoPlay={true}
              muted={true}
              controls={true}
              controlsList={`nodownload`}
              loop={true}
              poster={imgOpt(attrs.nft?.image, 600)!}
              src={attrs.nft.files[0].uri}
            />
          ) : (
            attrs.nft?.image && (
              <img
                onLoad={() => setImgLoaded(true)}
                onClick={() =>
                  track('Feed Item Selected', {
                    event_category: 'Alpha',
                    event_label: props.event.__typename,
                    sol_value: attrs.solAmount,
                    feedEventType: props.event.__typename,
                    feedEventsCount: props.allEventsRef?.length,
                  })
                }
                className="aspect-square w-full rounded-lg object-cover "
                src={imgOpt(attrs.nft?.image || '', 600)}
                alt={attrs.nft?.name}
              />
            )
          )}
        </a>
      </Link>
      <ShareMenu className="absolute top-4 right-4 " address={attrs.nft.address!} />
      <div className="absolute bottom-0 left-0 right-0 flex items-center p-4 text-base">
        <FeedActionBanner attrs={attrs} event={props.event} options={props.options} />
      </div>
    </div>
  );
}

function FollowCard(props: {
  event: FeedQueryEvent;
  attrs: FeedCardAttributes;
  myFollowingList?: string[];
  className?: string;
}) {
  const myFollowingList = props.myFollowingList || [];
  const attrs = props.attrs;
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();
  const walletConnectionPair = useMemo(
    () => ({ wallet: anchorWallet!, connection }),
    [anchorWallet, connection]
  );

  if (!attrs) return <div>Not enough data</div>;

  return (
    <div
      className={classNames(
        'flex flex-wrap items-center rounded-3xl bg-gray-900 p-4 shadow-2xl shadow-black md:rounded-full',
        false && 'hover:scale-[1.02]',
        props.className
      )}
    >
      <ProfilePFP
        user={{
          address: props.event.walletAddress, // props.event.walletAddress,
          profile: props.event.profile,
        }}
      />
      <div className="ml-4">
        <div className="text-base font-semibold">
          Followed <ProfileHandle user={attrs.toUser!} />
        </div>
        <div className="flex space-x-4 text-sm">
          <ProfileHandle
            user={{
              address: props.event.walletAddress,
              profile: props.event.profile,
            }}
          />
          <span>{DateTime.fromISO(attrs.createdAt).toRelative()}</span>
        </div>
      </div>
      {walletConnectionPair.wallet && (
        <div className="mt-4 w-full sm:ml-auto sm:mt-0 sm:w-auto">
          <FollowUnfollowButton
            source="feed"
            className="!w-full sm:ml-auto sm:w-auto"
            walletConnectionPair={walletConnectionPair}
            toProfile={{
              address: attrs.toUser!.address,
            }}
            type={myFollowingList.includes(attrs.toUser!.address) ? 'Unfollow' : 'Follow'} // needs to be dynamic
          />
        </div>
      )}
    </div>
  );
}

export const ProfileHandle = ({ user }: { user: User }) => {
  const [twitterHandle, setTwitterHandle] = useState(user.profile?.handle);
  const [twitterHandleQuery, twitterHandleQueryContext] = useTwitterHandleFromPubKeyLazyQuery();

  useEffect(() => {
    async function getTwitterHandleAndSetState(): Promise<void> {
      await twitterHandleQuery({ variables: { pubKey: user.address } });
      if (twitterHandleQueryContext.data?.wallet.profile?.handle) {
        setTwitterHandle(twitterHandleQueryContext.data?.wallet.profile?.handle);
      }
    }
    if (!twitterHandle) {
      getTwitterHandleAndSetState();
    }
  }, []);

  return (
    <Link href={'/profiles/' + user.address + '/nfts'} passHref>
      <a>{(twitterHandle && '@' + twitterHandle) || shortenAddress(user.address)}</a>
    </Link>
  );
};

function FeedActionBanner(props: {
  event: FeedQueryEvent; //  Omit<FeedQueryEvent, 'FollowEvent' | 'AggregateEvent'>;
  attrs: FeedCardAttributes;
  options?: FeedCardOptions;
}) {
  const attrs = props.attrs;
  const anchorWallet = useAnchorWallet();
  const myPubkey = anchorWallet?.publicKey.toBase58();
  const { track } = useAnalytics();
  if (!attrs?.sourceUser) return <div>Can not describe {props.event.__typename} </div>;

  let action: JSX.Element | null = null;
  const yourEvent = props.event.walletAddress === myPubkey;
  const youOwnThisNFT = attrs.nft?.owner?.address === myPubkey;
  if (props.options?.hideAction) {
    action = null;
  } else if (props.event.__typename === 'ListingEvent' && !yourEvent) {
    action = <PurchaseAction listingEvent={props.event as ListingEvent} nft={attrs.nft} />;
  } else if (props.event.__typename === 'OfferEvent' && youOwnThisNFT) {
    action = (
      <Link href={'/nfts/' + attrs.nft?.address}>
        <a target="_blank">
          <Button5
            v="primary"
            onClick={() => {
              track('Feed Accept Offer Initiated', {
                event_category: 'Alpha',
                event_label: attrs.nft?.name!,
                nftAddress: attrs.nft?.address,
              });
            }}
            className="w-full sm:w-auto"
          >
            Accept offer
          </Button5>
        </a>
      </Link>
    );
  } else if (!yourEvent) {
    action = <OfferAction nft={attrs.nft} />;
  }

  return (
    <div
      className={classNames(
        'flex w-full flex-wrap items-center  bg-gray-900/40 p-2 backdrop-blur-[200px] transition-all group-hover:bg-gray-900 ',
        props.options?.hideAction ? 'rounded-full' : 'rounded-3xl sm:rounded-full'
      )}
    >
      <ProfilePFP
        user={{
          address: props.event.walletAddress,
          profile: props.event.profile,
        }}
      />
      <div className="ml-2">
        <div className="text-base font-semibold">{attrs.content}</div>
        <div className="flex text-sm">
          {/* {getHandle(attrs.sourceUser)}  */}
          <ProfileHandle user={attrs.sourceUser} />
          &nbsp;
          {DateTime.fromISO(attrs.createdAt).toRelative()}
        </div>
      </div>
      {!props.options?.hideAction && (
        <div className="ml-auto mt-4 w-full sm:mt-0 sm:w-auto ">{action}</div>
      )}
    </div>
  );
}

const PurchaseAction = (props: { listingEvent: ListingEvent; nft: any }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { track } = useAnalytics();
  const [callMarketplaceQuery, marketplaceQuery] = useNftMarketplaceLazyQuery({
    variables: {
      subdomain: HOLAPLEX_MARKETPLACE_SUBDOMAIN,
      address: props.nft!.address!,
    },
  });

  useEffect(() => {
    if (modalOpen) {
      callMarketplaceQuery();
    }
  }, [modalOpen]);

  // TODO: Make sure the NFT is still for sale. For now, just link to NFT details page

  return (
    <>
      <Link href={'/nfts/' + props.nft.address} passHref>
        <a target="_blank">
          {/* Buy in feed context onClick={() => setModalOpen(true)} */}
          <Button5
            v="primary"
            onClick={() => {
              track('Feed Purchase Initiated', {
                event_category: 'Alpha',
                event_label: props.nft?.name,
                nftAddress: props.nft?.address,
              });
            }}
            className="w-full sm:w-auto"
          >
            Buy now
          </Button5>
        </a>
      </Link>
      {ReactDom.createPortal(
        <Modal title={`Make an offer`} open={modalOpen} setOpen={setModalOpen}>
          {props.nft! && <NFTPreview loading={false} nft={props.nft as Nft | any} />}

          {marketplaceQuery.data && (
            <div className={`mt-8 flex w-full`}>
              <BuyForm
                // @ts-ignore
                listing={props.listingEvent.listing!}
                nft={marketplaceQuery.data.nft as any}
                marketplace={marketplaceQuery.data.marketplace as Marketplace}
                refetch={() => {
                  marketplaceQuery.refetch();
                  setModalOpen(false);
                }}
              />
            </div>
          )}
        </Modal>,
        document.getElementsByTagName('body')[0]!
      )}
    </>
  );
};

const OfferAction = (props: { nft: any }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const [callMarketplaceQuery, marketplaceQuery] = useNftMarketplaceLazyQuery({
    variables: {
      subdomain: HOLAPLEX_MARKETPLACE_SUBDOMAIN,
      address: props.nft!.address!,
    },
  });

  const { track } = useAnalytics();
  useEffect(() => {
    if (modalOpen && !marketplaceQuery.called) {
      callMarketplaceQuery();
    }
  }, [modalOpen]);

  return (
    <>
      <Button5
        v="primary"
        onClick={() => {
          setModalOpen(true);
          track('Feed Offer Initiated', {
            event_category: 'Alpha',
            event_label: props.nft?.name,
            nftAddress: props.nft?.address,
          });
        }}
        className="w-full sm:w-auto"
      >
        Make offer
      </Button5>
      {ReactDom.createPortal(
        <Modal title={`Make an offer`} open={modalOpen} setOpen={setModalOpen}>
          {props.nft! && <NFTPreview loading={false} nft={props.nft as Nft | any} />}
          {marketplaceQuery.loading && (
            <div className="flex justify-center">
              <TailSpin color={`grey`} />
            </div>
          )}
          {marketplaceQuery.data && (
            <div className={`mt-8 flex w-full`}>
              <OfferForm
                nft={marketplaceQuery.data.nft as any}
                marketplace={marketplaceQuery.data.marketplace as Marketplace}
                refetch={() => {
                  marketplaceQuery.refetch();
                  setModalOpen(false);
                }}
                reroute={false}
              />
            </div>
          )}
        </Modal>,
        document.getElementsByTagName('body')[0]!
      )}
    </>
  );
};

export function ProfilePFP({ user }: { user: User }) {
  // Note, we only invoke extra queries if the prop user does not have necceary info
  const [twitterHandle, setTwitterHandle] = useState(user.profile?.handle);
  const [pfpUrl, setPfpUrl] = useState(
    user.profile?.profileImageUrl || getPFPFromPublicKey(user.address)
  );
  const [twitterHandleQuery, twitterHandleQueryContext] = useTwitterHandleFromPubKeyLazyQuery();

  useEffect(() => {
    async function getTwitterHandleAndSetState(): Promise<void> {
      await twitterHandleQuery({ variables: { pubKey: user.address } });
      if (twitterHandleQueryContext.data?.wallet.profile?.handle) {
        setTwitterHandle(twitterHandleQueryContext.data?.wallet.profile?.handle);
      }
    }
    if (!twitterHandle) {
      getTwitterHandleAndSetState();
    }
  }, []);

  const [walletProfileQuery, walletProfile] = useWalletProfileLazyQuery({
    variables: {
      handle: twitterHandle ?? '',
    },
  });

  useEffect(() => {
    if (twitterHandle && !user.profile?.profileImageUrl) {
      walletProfileQuery().then((q) => {
        if (q.data?.profile?.profileImageUrlLowres) {
          setPfpUrl(q.data?.profile?.profileImageUrlLowres);
        }
      });
    }
  }, [twitterHandle]);

  /*  const { track } = useAnalytics(); // track navigation to profile from pfp */

  return (
    <Link href={'/profiles/' + user.address + '/nfts'} passHref>
      <a target="_blank">
        <img
          className={classNames('rounded-full', 'h-10 w-10')}
          src={walletProfile.data?.profile?.profileImageUrlLowres || pfpUrl}
          alt={'profile picture for ' + user.profile?.handle || user.address}
        />
      </a>
    </Link>
  );
}

function ShareMenu(props: { address: string; className: string }) {
  return (
    <div className={props.className}>
      <MoreDropdown
        address={props.address}
        triggerButtonExtraClassNames="bg-gray-900/40 backdrop-blur-3xl group-hover:bg-gray-900"
      />
    </div>
  );
}

const ProfileMiniCard = ({ user, myFollowingList }: { user: User; myFollowingList?: string[] }) => {
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();
  const walletConnectionPair = useMemo(
    () => ({ wallet: anchorWallet!, connection }),
    [anchorWallet, connection]
  );

  return (
    <div className={`flex flex-col items-center gap-2 p-4`}>
      <ProfilePFP user={user} />
      <p className={`m-0 text-base font-semibold`}>
        <ProfileHandle user={user} />
      </p>
      <FollowUnfollowButton
        source={'feed'}
        className={`!w-full sm:ml-auto sm:w-auto`}
        walletConnectionPair={walletConnectionPair}
        toProfile={{ address: user.address }}
        type={myFollowingList?.includes(user.address) ? 'Unfollow' : 'Follow'}
      />
    </div>
  );
};

// A card to house aggregated Mint events, and maybe follow events
function FollowAggregateCard(props: { event: AggregateEvent; myFollowingList?: string[] }) {
  const CAROUSEL_COLS: number = 3;
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className={`flex flex-col rounded-lg bg-gray-900 p-4 shadow-2xl shadow-black`}>
      <div className={`flex w-full items-center gap-4 border-b border-b-gray-800 pb-4`}>
        <ProfilePFP user={{ address: props.event.walletAddress, profile: props.event.profile }} />
        <div className={`flex flex-col gap-2`}>
          <p className={`m-0 text-base`}>
            <span className={`font-semibold`}>
              <ProfileHandle
                user={{ address: props.event.walletAddress, profile: props.event.profile }}
              />
            </span>
            &nbsp;followed {props.event.eventsAggregated.length} people
          </p>
          <p className={`m-0 text-xs text-gray-300`}>
            {aggregateEventsTime(props.event.eventsAggregated).toRelative()}
          </p>
        </div>
      </div>
      <div className={`grid w-full grid-cols-3 grid-rows-1 overflow-x-visible`}>
        {props.event.eventsAggregated.map((e: any) => (
          <ProfileMiniCard
            key={e.feedEventId + e?.connection?.to?.address}
            user={{
              address: e?.connection?.to?.address,
              profile: e.connection.to?.profile,
            }}
            myFollowingList={props.myFollowingList}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div
      className={classNames(
        'flex flex-wrap items-center rounded-full bg-gray-800 p-4 shadow-2xl shadow-black',
        false && 'hover:scale-[1.02]'
      )}
    >
      <div className="mx-auto flex justify-center sm:mx-0">
        and {props.event.eventsAggregated.length - 1} similar events
      </div>
      <Button5 className="ml-auto w-full sm:w-auto" v="ghost" onClick={() => setModalOpen(true)}>
        View all
      </Button5>
      {ReactDom.createPortal(
        <Modal
          open={modalOpen}
          setOpen={setModalOpen}
          title={'Aggregate (' + props.event.eventsAggregated.length + ')'}
        >
          <div className="space-y-10 p-4">
            {props.event.eventsAggregated.map((e) => (
              <FeedCard event={e} key={e.feedEventId} />
            ))}
          </div>
        </Modal>,
        document.getElementsByTagName('body')[0]!
      )}
    </div>
  );
}

export const LoadingFeedCard = () => {
  return (
    <div
      className={`relative flex aspect-square animate-pulse flex-col justify-end  rounded-lg border-gray-900 bg-gray-900 p-4 shadow-2xl shadow-black`}
    >
      <div className={`h-12 w-full rounded-full bg-gray-800`} />
      <div className={`absolute top-4 right-4 h-10 w-10 rounded-full bg-gray-800`} />
    </div>
  );
};

export const LoadingFeedItem = () => {
  return (
    <div
      className={`flex h-16 w-full animate-pulse items-center justify-between rounded-lg bg-gray-900 p-4 shadow-2xl shadow-black`}
    >
      <div className={`h-10 w-10 rounded-full bg-gray-800`} />
      <div className={`h-10 w-32 rounded-full bg-gray-800`} />
    </div>
  );
};

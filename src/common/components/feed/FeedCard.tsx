import ReactDom from 'react-dom';

import { HOLAPLEX_MARKETPLACE_SUBDOMAIN } from '@/common/constants/marketplace';
import { getPFPFromPublicKey } from '@/modules/utils/image';
import { shortenAddress, shortenHandle } from '@/modules/utils/string';
import { Marketplace } from '@holaplex/marketplace-js-sdk';
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
  AggregateSaleEvent,
  FeedCardAttributes,
  FeedItem,
  FeedQueryEvent,
  generateFeedCardAttributes,
  getAggregateProfiles,
  User,
} from './feed.utils';
import BuyForm from '../forms/BuyForm';
import { TailSpin } from 'react-loader-spinner';
import { useAnalytics } from '@/common/context/AnalyticsProvider';
import { LoadingContainer } from '../elements/LoadingPlaceholders';
import { imgOpt } from '@/common/utils';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';
import { Avatar } from '../elements/Avatar';
import { useConnectedWalletProfile } from '@/common/context/ConnectedWalletProfileProvider';

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

  if (props.event.__typename === 'AggregateEvent') {
    return <FollowAggregateCard event={props.event} myFollowingList={props.myFollowingList} />;
  }

  const attrs = generateFeedCardAttributes(props.event, props.myFollowingList);

  if (props.event.__typename === 'AggregateSaleEvent') {
    return <SaleAggregateCard event={props.event} myFollowingList={props.myFollowingList} />;
  }

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
      {/* <div className={`absolute top-4 left-4`}>
        <Link href={`/profiles/${attrs.nft.creators[0].address}/created`} passHref>
          <span className={`hover:cursor-pointer`}>
            <Avatar
              address={attrs.nft.creators[0].address}
              showAddress={false}
              border={true}
              data={{
                pfpUrl: attrs?.nft?.creators[0]?.profile?.profileImageUrlLowres,
                twitterHandle: attrs?.nft?.creators[0]?.twitterHandle || ``,
              }}
            />
          </span>
        </Link>
      </div> */}
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

  const { connectedProfile } = useConnectedWalletProfile();

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
      <div className="ml-4 flex flex-col justify-start gap-2">
        <div className="text-base font-semibold">
          <ProfileHandle user={attrs.sourceUser} />
          &nbsp;
          {myFollowingList.includes(attrs.sourceUser!.address) &&
          attrs.toUser!.address === connectedProfile?.pubkey ? (
            <>
              <span className={`text-base font-normal`}>followed you back</span>
            </>
          ) : (
            <>
              <span className={`text-base font-normal`}>followed</span>
              &nbsp;
              <ProfileHandle user={attrs.toUser!} />
            </>
          )}
        </div>
        <p className={`m-0 text-xs text-gray-300`}>
          {DateTime.fromISO(attrs.createdAt).toRelative()}
        </p>
      </div>
      {connectedProfile?.walletConnectionPair && (
        <div className="mt-4 w-full sm:ml-auto sm:mt-0 sm:w-auto">
          <FollowUnfollowButton
            source="feed"
            className="!w-full sm:ml-auto sm:w-auto"
            walletConnectionPair={connectedProfile.walletConnectionPair}
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

export const ProfileHandleStack = ({ users }: { users: User[] }) => {
  return (
    <div>
      {users.length > 2 ? (
        <p className={`m-0 text-base font-bold`}>
          <ProfileHandle user={users[0]} />

          <span className={`text-base font-normal`}>&nbsp;and&nbsp;</span>
          <span className={`m-0`}>{users.length - 1} others</span>
        </p>
      ) : (
        <p className={`m-0`}>
          {users.slice(0, 2).map((user, i) => (
            <span key={user.address} className={`m-0 text-base font-bold`}>
              <ProfileHandle user={user} />

              {i === 0 && users.length > 1 && (
                <span className={`text-base font-normal`}>&nbsp;and&nbsp;</span>
              )}
            </span>
          ))}
        </p>
      )}
    </div>
  );
};

export const ProfileHandle = ({ user, shorten = false }: { user: User; shorten?: boolean }) => {
  const [twitterHandle, setTwitterHandle] = useState(user.profile?.handle);
  const [twitterHandleQuery, twitterHandleQueryContext] = useTwitterHandleFromPubKeyLazyQuery();

  useEffect(() => {
    async function getTwitterHandleAndSetState(): Promise<void> {
      await twitterHandleQuery({ variables: { pubKey: user.address } });
      if (twitterHandleQueryContext.data?.wallet.profile?.handle) {
        setTwitterHandle(twitterHandleQueryContext.data?.wallet.profile?.handle);
      }
    }
    if (!twitterHandle && false) {
      // pausing requesting additional twitter handles as it leads to too many requests
      getTwitterHandleAndSetState();
    }
  }, []);

  return (
    <Link href={'/profiles/' + user.address + '/nfts'} passHref>
      <a>
        {user.profile?.handle
          ? `@${shorten ? shortenHandle(user.profile?.handle) : user.profile?.handle}`
          : `@${shortenAddress(user.address)}`}
      </a>
    </Link>
  );
};

function FeedActionBanner(props: {
  event: FeedItem; //  Omit<FeedQueryEvent, 'FollowEvent' | 'AggregateEvent'>;
  attrs: FeedCardAttributes;
  options?: FeedCardOptions;
}) {
  const attrs = props.attrs;

  const { connectedProfile } = useConnectedWalletProfile();

  const myPubkey = connectedProfile?.pubkey;

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
        'flex w-full flex-col flex-nowrap items-center justify-between bg-gray-900/40  p-2 backdrop-blur-[200px] transition-all group-hover:bg-gray-900 sm:flex-row ',
        props.options?.hideAction ? 'rounded-full' : 'rounded-3xl sm:rounded-full'
      )}
    >
      <div className={`flex items-center`}>
        {attrs && (
          <ProfilePFP
            user={{
              address: attrs.sourceUser.address,
              profile: attrs.sourceUser.profile,
            }}
          />
        )}

        <div className="ml-2 flex max-w-xs flex-col gap-2">
          <div className={`flex text-base font-semibold`}>
            <ProfileHandle user={attrs.sourceUser} />
            &nbsp;
            <div className="text-base font-normal">{attrs.content}</div>
            &nbsp;
            {attrs.type === `MintEvent` && (
              <div className={`truncate text-clip text-base`}>
                {attrs?.nft?.name.slice(0, 8)}
                {(attrs.nft?.name?.length || 0) > 8 && `...`}
              </div>
            )}
          </div>
          <div className="flex text-xs">
            {/* {getHandle(attrs.sourceUser)}  */}
            &nbsp;
            {DateTime.fromISO(attrs.createdAt).toRelative()}
          </div>
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
        className="w-full whitespace-nowrap sm:w-auto"
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

export const ProfilePFPStack = ({ users }: { users: User[] }) => {
  return (
    <div className={`inline-flex items-center`}>
      {users.slice(0, 3).map((user, i) => (
        <div
          key={user.address}
          className={`${
            i > 0 && `-ml-6`
          } transition duration-100 ease-in hover:z-10 hover:scale-105`}
        >
          <ProfilePFP user={user} />
        </div>
      ))}
      {users.length > 4 && (
        <button
          className={`-ml-6 flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 transition duration-100 ease-in hover:z-10 hover:scale-105`}
        >
          +{users.length - 3}
        </button>
      )}
    </div>
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
    if (!twitterHandle && false) {
      // pausing requesting additional twitter handles as it leads to too many requests

      getTwitterHandleAndSetState();
    }
  }, [user, twitterHandle, twitterHandleQuery]);

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
  }, [twitterHandle, user, walletProfileQuery]);

  /*  const { track } = useAnalytics(); // track navigation to profile from pfp */

  return (
    <Link href={'/profiles/' + user.address + '/nfts'} passHref>
      <a target="_blank">
        <img
          className={classNames('rounded-full', 'h-10 w-10')}
          src={user?.profile?.profileImageUrl || getPFPFromPublicKey(user.address)}
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
  const { connectedProfile } = useConnectedWalletProfile();

  if (!user.address) {
    return null;
  }

  return (
    <div className={`flex w-64 max-w-xs flex-col items-center gap-2 p-4`}>
      <ProfilePFP user={user} />
      <p className={`m-0 text-base font-semibold`}>
        <ProfileHandle user={user} shorten={true} />
      </p>
      {user.address === connectedProfile?.pubkey ? (
        <Button5
          v={`secondary`}
          type={`button`}
          className={`h-8 !w-full sm:ml-auto sm:w-auto lg:h-10 lg:w-28`}
        >
          View
        </Button5>
      ) : (
        <FollowUnfollowButton
          source={'feed'}
          className={`!w-full sm:ml-auto sm:w-auto`}
          walletConnectionPair={connectedProfile?.walletConnectionPair!}
          toProfile={{ address: user.address }}
          type={myFollowingList?.includes(user.address) ? 'Unfollow' : 'Follow'}
        />
      )}
    </div>
  );
};

const AggregateProfiles = (props: { event: AggregateEvent }) => {
  const users = getAggregateProfiles(props.event);

  return (
    <div className={`flex min-w-max`}>
      <ProfilePFPStack users={users} />
    </div>
  );
};

const AggregateHandles = (props: { event: AggregateEvent }) => {
  const users = getAggregateProfiles(props.event);
  return (
    <div className={`inline-flex`}>
      <ProfileHandleStack users={users} />
    </div>
  );
};

// A card to house aggregated Mint events, and maybe follow events
function FollowAggregateCard(props: { event: AggregateEvent; myFollowingList?: string[] }) {
  const CAROUSEL_COLS: number = 3;
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className={`flex flex-col rounded-lg bg-gray-900 p-4 pb-0 shadow-2xl shadow-black`}>
      <div className={`flex w-full items-center gap-4 border-b border-b-gray-800 pb-4`}>
        <AggregateProfiles event={props.event} />
        <div className={`flex w-full flex-col gap-2`}>
          <div className={`text-base`}>
            <AggregateHandles event={props.event} />
            &nbsp;followed {props.event.eventsAggregated.length} people
          </div>
          <p className={`m-0 text-xs text-gray-300`}>
            {aggregateEventsTime(props.event.eventsAggregated).toRelative()}
          </p>
        </div>
      </div>
      <div
        className={`flex w-full gap-4 overflow-x-scroll pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-900`}
      >
        {props.event.eventsAggregated.map((e: any) => (
          <ProfileMiniCard
            key={e.feedEventId + e?.connection?.to?.address}
            user={{
              address: e?.connection?.to?.address,
              profile: e.connection?.to?.profile,
            }}
            myFollowingList={props.myFollowingList}
          />
        ))}
      </div>
    </div>
  );
}

export const NFTCarousel = ({
  nfts,
  feedEvent,
  interval = 5000,
  attrs,
}: {
  nfts: Nft[];
  feedEvent: FeedItem;
  interval?: number;
  attrs?: FeedCardAttributes[];
}) => {
  const STARTING_INDEX = 0;
  const [currAttr, setCurrAttr] = useState<Nft>(nfts[STARTING_INDEX]);
  const [isHovered, setIsHovered] = useState(false);

  const getNextEvent = (list: any[], currIndex: number) => {
    if (list.length === currIndex + 1) {
      return list[0];
    } else {
      return list[currIndex + 1];
    }
  };

  const getPreviousEvent = (list: any[], currIndex: number) => {
    if (currIndex === 0) {
      return list[list.length - 1];
    } else {
      return list[currIndex - 1];
    }
  };
  useEffect(() => {
    const intervalId = setInterval(() => {
      const nextEvent = getNextEvent(
        nfts,
        nfts.findIndex((nfts) => nfts?.address === currAttr?.address)
      );
      if (!isHovered) setCurrAttr(nextEvent);
    }, interval ?? 3000);

    return () => clearInterval(intervalId);
  }, [currAttr, interval, nfts, isHovered]);

  const setNextEvent = (nft: Nft) => {
    setCurrAttr(nft);
  };

  const getCurrentIndex = () => {
    return nfts.findIndex((nft) => nft?.address === currAttr?.address);
  };

  if (!nfts) {
    return null;
  }

  return (
    <div
      onMouseOver={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative transition-all duration-300 hover:scale-[1.02]`}
    >
      <Link href={`/nfts/${currAttr?.address}`} passHref>
        <a>
          <img
            src={currAttr?.image}
            className={`aspect-square w-full rounded-lg object-cover`}
            alt={currAttr?.name}
          />
        </a>
      </Link>
      {/* <div className={`absolute top-4 left-4`}>
        <Link href={`/profiles/${currAttr?.creators[0].address}/created`} passHref>
          <span className={`hover:cursor-pointer`}>
            <Avatar
              address={currAttr?.creators[0]?.address}
              showAddress={false}
              border={true}
              data={{
                pfpUrl: currAttr?.creators[0]?.profile?.profileImageUrlLowres,
                twitterHandle: currAttr?.creators[0]?.twitterHandle || ``,
              }}
            />
          </span>
        </Link>
      </div> */}
      <ShareMenu className="absolute top-4 right-4 " address={currAttr?.address!} />
      <div
        className={`absolute left-4 top-1/2 flex items-center rounded-full p-2 hover:bg-gray-900/40 hover:backdrop-blur-3xl`}
      >
        <button
          onClick={() =>
            setNextEvent(
              getPreviousEvent(
                nfts,
                nfts.findIndex((nft) => nft?.address === currAttr?.address)
              )
            )
          }
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </button>
      </div>
      <div
        className={`absolute right-4 top-1/2 flex items-center rounded-full p-2 hover:bg-gray-900/40 hover:backdrop-blur-3xl`}
      >
        <button
          onClick={() =>
            setNextEvent(
              getNextEvent(
                nfts,
                nfts.findIndex((nft) => nft?.address === currAttr?.address)
              )
            )
          }
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>
      <div
        className={`absolute ${
          attrs ? `top-6` : `top-6`
        } left-1/2 flex -translate-x-1/2 items-center gap-1 space-x-3 rounded-full bg-gray-900/80 p-2 transition-all duration-300 ease-in-out`}
      >
        {nfts.map((nft, i) => (
          <button
            onClick={() => setNextEvent(nft)}
            className={`h-2 w-2 rounded-full ${
              currAttr?.address === nft?.address ? `bg-white` : `bg-gray-300`
            }`}
            key={`indicator-${i}`}
          />
        ))}
      </div>
      {attrs && (
        <div className="absolute bottom-0 left-0 right-0 flex items-center p-4 text-base">
          <FeedActionBanner attrs={attrs[getCurrentIndex()]} event={feedEvent} />
        </div>
      )}
    </div>
  );
};

const SaleAggregateCard = (props: { event: AggregateSaleEvent; myFollowingList?: string[] }) => {
  const attrs = props.event.eventsAggregated.map((e, i) => {
    return generateFeedCardAttributes(e, props.myFollowingList);
  });
  const nfts = attrs.map((attr) => {
    return attr?.nft;
  });

  return (
    <div
      id={props.event.feedEventId}
      className={`group relative transition-all hover:scale-[1.02]`}
    >
      <NFTCarousel nfts={nfts as Partial<Nft> as any} feedEvent={props.event} attrs={attrs} />
    </div>
  );
};

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

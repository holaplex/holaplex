import ReactDom from 'react-dom';

import { HOLAPLEX_MARKETPLACE_SUBDOMAIN } from '@/common/constants/marketplace';
import { getTwitterHandle, useTwitterHandle } from '@/common/hooks/useTwitterHandle';
import { getPFPFromPublicKey } from '@/modules/utils/image';
import { shortenAddress } from '@/modules/utils/string';
import { Popover } from '@headlessui/react';
import { ShareIcon } from '@heroicons/react/outline';
import { Marketplace } from '@holaplex/marketplace-js-sdk';
import { AnchorWallet, useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import classNames from 'classnames';
import { DateTime } from 'luxon';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  FeedEvent,
  FeedQuery,
  Nft,
  useNftMarketplaceQuery,
  useWalletProfileQuery,
  Wallet,
} from 'src/graphql/indexerTypes';
import { FollowEvent } from 'src/graphql/indexerTypes.ssr';
import { JsxElement } from 'typescript';
import { Button5 } from '../elements/Button2';
import { FollowUnfollowButton } from '../elements/FollowUnfollowButton';
import Modal from '../elements/Modal';
import MoreDropdown from '../elements/MoreDropdown';
import NFTPreview from '../elements/NFTPreview';
import OfferForm from '../forms/OfferForm';
import {
  AggregateEvent,
  FeedCardAttributes,
  FeedItem,
  FeedQueryEvent,
  generateFeedCardAtributes,
  getHandle,
  User,
} from './feed.utils';

export function FeedCardContainer(props: { anchorWallet: AnchorWallet; event: FeedItem }) {
  const myFollowingList = [
    'FBNrpSJiM2FCTATss2N6gN9hxaNr6EqsLvrGBAi9cKW7',
    '2BNABAPHhYAxjpWRoKKnTsWT24jELuvadmZALvP6WvY4',
    'GJMCz6W1mcjZZD8jK5kNSPzKWDVTD4vHZCgm8kCdiVNS',
    '2fLigDC5sgXmcVMzQUz3vBqoHSj2yCbAJW1oYX8qbyoR',
  ]; // ideally gotten from a context hook or something

  const attrs = generateFeedCardAtributes(props.event, myFollowingList);
  // console.log('Feed card', {
  //   event: props.event,
  //   attrs,
  // });

  if (!attrs) return <div>Can not describe {props.event.__typename} </div>;

  if (props.event.__typename === 'FollowEvent')
    return <FollowCard attrs={attrs} event={props.event} />;

  if (!attrs.nft) return <div>{props.event.__typename} is malformed</div>;

  return (
    <FeedCard2
      content={attrs.content}
      sourceUser={attrs.sourceUser}
      createdAt={attrs.createdAt}
      nft={attrs.nft}
    />
  );
}

interface FeedCardProps {
  content: string;
  sourceUser: { address: string };
  nft: { address: string; image: string; name: string };
  createdAt: string;
}

function FeedCard2(props: FeedCardProps) {
  // needs a way to encapsulate various actions. Could be as simple as "children"
  return (
    <div className="group relative transition-all  hover:scale-[1.02] ">
      <Link href={'/nfts/' + props.nft.address} passHref>
        <a>
          <img
            className="aspect-square w-full rounded-lg "
            src={props.nft?.image}
            alt={props.nft?.name}
          />
        </a>
      </Link>
      <ShareMenu className="absolute top-4 right-4 " address={props.nft.address} />
      <div className="absolute bottom-0 left-0 right-0 flex items-center p-4 text-base">
        {/* <FeedActionBanner event={props.event} /> */}
        <div className="flex w-full items-center rounded-full bg-gray-900/40 p-2 backdrop-blur-[200px] transition-all group-hover:bg-gray-900">
          <ProfilePFP user={props.sourceUser} />
          <div className="ml-2">
            <div className="text-base font-semibold">{props.content}</div>
            <div className="flex text-sm">
              {/* {getHandle(attrs.sourceUser)}  */}
              <ProfileHandle address={props.sourceUser.address} />
              &nbsp;
              {DateTime.fromISO(props.createdAt).toRelative()}
            </div>
          </div>
          <div className="ml-auto">
            <Button5 v="primary">Make offer</Button5>
          </div>
        </div>
      </div>
    </div>
  );
}

function AggregateCard(props: { event: AggregateEvent }) {
  const [modalOpen, setModalOpen] = useState(false);

  // return (
  //   <div className="relative  flex -space-x-96 -space-y-4  ">
  //     {props.event.eventsAggregated.slice(1, 5).map((e, i, l) => (
  //       // <FeedCard
  //       //   event={e}
  //       //   key={e.feedEventId}
  //       //   anchorWallet={props.anchorWallet}
  //       //   className={` hover:z-50 z-${(l.length - i) * 10}  `}
  //       // />
  //       <img
  //         key={e.feedEventId}
  //         className={classNames(
  //           ` hover:z-50 z-${(l.length - i) * 10}  `,
  //           'aspect-square w-full rounded-lg '
  //         )}
  //         src={e.nft?.image}
  //         alt={e.nft?.name}
  //       />
  //     ))}
  //   </div>
  // );

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

export function FeedCard(props: {
  event: FeedItem;
  marketplace?: Marketplace;
  myFollowingList?: string[];
  className?: string;
  refetch?: any;
}) {
  if (props.event.__typename === 'AggregateEvent') {
    return <AggregateCard event={props.event} />;
  }

  const attrs = generateFeedCardAtributes(props.event, props.myFollowingList);
  // console.log('Feed card', props.event.feedEventId, {
  //   event: props.event,
  //   attrs,
  // });

  if (!attrs) return <div>Can not describe {props.event.__typename} </div>;

  if (props.event.__typename === 'FollowEvent')
    return <FollowCard attrs={attrs} event={props.event} myFollowingList={props.myFollowingList} />;

  if (!attrs.nft) return <div>{props.event.__typename} is malformed</div>;

  return (
    <div
      id={props.event.feedEventId}
      className={classNames('group relative transition-all  hover:scale-[1.02] ', props.className)}
    >
      <Link href={'/nfts/' + attrs.nft.address} passHref>
        <a>
          <img
            className="aspect-square w-full rounded-lg object-cover "
            src={attrs.nft?.image}
            alt={attrs.nft?.name}
          />
        </a>
      </Link>
      <ShareMenu className="absolute top-4 right-4 " address={attrs.nft.address} />
      <div className="absolute bottom-0 left-0 right-0 flex items-center p-4 text-base">
        <FeedActionBanner
          event={props.event}
          marketplace={props.marketplace}
          refetch={props.refetch}
        />
      </div>
    </div>
  );
}

function FollowCard(props: {
  event: FeedItem;
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

  console.log(attrs.content, {
    followingList: props.myFollowingList,
    attrs: attrs,
  });

  return (
    <div
      className={classNames(
        'flex flex-wrap items-center rounded-3xl bg-gray-900 p-4 shadow-2xl shadow-black md:rounded-full',
        false && 'hover:scale-[1.02]',
        props.className
      )}
    >
      <ProfilePFP user={attrs.sourceUser} />
      <div className="ml-4">
        <div className="text-base font-semibold">
          {/* {attrs.content} */}
          {/* Started following
              {attrs.toUser?.profile?.handle || shortenAddress(attrs.toUser.address)} */}
          Followed{' '}
          <Link href={'/profiles/' + attrs.toUser?.address}>
            <a target="_blank">{getHandle(attrs.toUser!)}</a>
          </Link>
        </div>
        <div className="flex space-x-4 text-sm">
          <Link href={'/profiles/' + attrs.sourceUser.address + '/nfts'} passHref>
            <a target="_blank" className="font-medium">
              {getHandle(attrs.sourceUser)}
              {/* {attrs.sourceUser.profile?.handle || shortenAddress(attrs.sourceUser.address)} */}
            </a>
          </Link>
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

export const ProfileHandle = (props: { address: string }) => {
  const { data: twitterHandle } = useTwitterHandle(null, props.address);

  return (
    <Link href={'/profiles/' + props.address + '/nfts'} passHref>
      <a>{(twitterHandle && '@' + twitterHandle) || shortenAddress(props.address)}</a>
    </Link>
  );
};

function FeedActionBanner(props: {
  event: FeedItem; //  Omit<FeedQueryEvent, 'FollowEvent' | 'AggregateEvent'>;
  marketplace?: Marketplace;
  refetch?: any;
}) {
  const attrs = generateFeedCardAtributes(props.event);
  const [modelOpen, setModalOpen] = useState(false);

  if (!attrs?.sourceUser) return <div>Can not describe {props.event.__typename} </div>;

  return (
    <>
      <div className="flex w-full flex-wrap items-center rounded-3xl bg-gray-900/40 p-2 backdrop-blur-[200px] transition-all group-hover:bg-gray-900 sm:rounded-full">
        <ProfilePFP user={attrs.sourceUser} />
        <div className="ml-2">
          <div className="text-base font-semibold">{attrs.content}</div>
          <div className="flex text-sm">
            {/* {getHandle(attrs.sourceUser)}  */}
            <ProfileHandle address={attrs.sourceUser.address} />
            &nbsp;
            {DateTime.fromISO(attrs.createdAt).toRelative()}
          </div>
        </div>
        <div className="ml-auto mt-4 w-full sm:mt-0 sm:w-auto ">
          {/* <Link href={'/nfts/' + attrs.nft?.address + '/offers/new'}>
            <a target="_blank"> */}
          <Button5 v="primary" onClick={() => setModalOpen(true)} className="w-full sm:w-auto">
            Make offer
          </Button5>
          {/* </a>
          </Link> */}
          {/* {props.marketplace && props.refetch && (
            <Modal title={`Make an offer`} open={modelOpen} setOpen={setModalOpen}>
              {props.event.nft! && (
                <NFTPreview loading={false} nft={props.event.nft as Nft | any} />
              )}

              <div className={`mt-8 flex w-full`}>
                <OfferForm
                  nft={props.event.nft as any}
                  marketplace={props.marketplace as Marketplace}
                  refetch={props.refetch}
                />
              </div>
            </Modal>
          )} */}
        </div>
      </div>
    </>
  );
}

function MakeOfferButton(props: { nft: any }) {
  const nft = props.nft;
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const {
    data: marketplace,
    loading,
    called,
    refetch,
  } = useNftMarketplaceQuery({
    fetchPolicy: `no-cache`,
    variables: {
      subdomain: HOLAPLEX_MARKETPLACE_SUBDOMAIN,
      address: nft.address,
    },
  });

  return (
    <>
      <Button5 v="primary">Make offer</Button5>
      <Modal title={`Make an offer`} open={offerModalOpen} setOpen={setOfferModalOpen}>
        {/* nft */}
        {nft && <NFTPreview loading={false} nft={nft as any} />}
        {/* form */}
        <div className={`mt-8 flex w-full`}>
          <OfferForm nft={nft as any} marketplace={marketplace as any} refetch={refetch} />
        </div>
      </Modal>
    </>
  );
}

export function ProfilePFP({ user }: { user: User }) {
  // some of these hooks could probably be lifted up, but keeping it here for simplicity
  const { connection } = useConnection();
  const [twitterHandle, setTwitterHandle] = useState<string | undefined>(user.profile?.handle);
  useEffect(() => {
    if (!twitterHandle) {
      getTwitterHandle(user.address, connection).then((twitterHandle) => {
        if (twitterHandle) setTwitterHandle(twitterHandle);
      });
    }
  });

  // const { data: twitterHandle } = useTwitterHandle(null, user.address);
  const walletProfile = useWalletProfileQuery({
    variables: {
      handle: twitterHandle ?? '',
    },
  });

  return (
    <Link href={'/profiles/' + user.address + '/nfts'} passHref>
      <a target="_blank">
        <img
          className={classNames('rounded-full', 'h-10 w-10')}
          src={
            walletProfile.data?.profile?.profileImageUrlLowres || getPFPFromPublicKey(user.address)
          }
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

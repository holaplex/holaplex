import { HOLAPLEX_MARKETPLACE_SUBDOMAIN } from '@/common/constants/marketplace';
import { useTwitterHandle } from '@/common/hooks/useTwitterHandle';
import { getPFPFromPublicKey } from '@/modules/utils/image';
import { shortenAddress } from '@/modules/utils/string';
import { Popover } from '@headlessui/react';
import { ShareIcon } from '@heroicons/react/outline';
import { AnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import classNames from 'classnames';
import { DateTime } from 'luxon';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { FeedEvent, useNftMarketplaceQuery, useWalletProfileQuery } from 'src/graphql/indexerTypes';
import { JsxElement } from 'typescript';
import { Button5 } from '../elements/Button2';
import { FollowUnfollowButton } from '../elements/FollowUnfollowButton';
import Modal from '../elements/Modal';
import MoreDropdown from '../elements/MoreDropdown';
import NFTPreview from '../elements/NFTPreview';
import OfferForm from '../forms/OfferForm';

interface User {
  address: string;
  profile?: {
    handle: string;
    pfp?: string;
  } | null;
}

type FeedCardAttributes =
  | {
      id: string;
      createdAt: string;
      type:
        | 'ListingEvent'
        | 'FollowEvent'
        | 'MintEvent'
        | 'OfferEvent'
        | 'PurchaseEvent'
        | undefined;
      content: string;
      sourceUser: User;
      toUser?: User;
      solAmount?: number;
      nft?: {
        address: string;
        name: string;
        image: string;
        description: string;
        creators: User[];
      } | null;
    }
  | undefined;

export function generateFeedCardAtributes(
  event: FeedEvent,
  myFollowingList?: string[]
): FeedCardAttributes {
  const base = {
    id: event.feedEventId,
    createdAt: event.createdAt,
    type: event.__typename,
  };
  let solAmount: number | undefined;
  switch (event.__typename) {
    case 'ListingEvent':
      solAmount = event.listing?.price / LAMPORTS_PER_SOL;
      return {
        ...base,
        sourceUser: {
          address: event.listing?.seller,
          profile: null,
        },
        solAmount,
        nft: event.listing?.nft,
        // listing: event.listing,
        content: `Listed at ${event.listing} for ${solAmount} SOL`,
      };

    case 'FollowEvent':
      return {
        ...base,
        type: 'FollowEvent',
        content: myFollowingList?.includes(event.connection?.to.address)
          ? 'Was followed by ' + getHandle(event.connection?.to!)
          : 'Followed ' + getHandle(event.connection?.to!),
        sourceUser: event.connection?.from!,
        toUser: event.connection?.to!,
      };

    case 'MintEvent':
      const creator = event.nft?.creators[0]!;
      return {
        ...base,
        content: 'Created',
        sourceUser: {
          address: creator.address,
          profile: creator.profile,
        },
        nft: event.nft,
      };
    case 'PurchaseEvent':
      solAmount = event.purchase?.price / LAMPORTS_PER_SOL;

      return {
        ...base,
        content: 'Bought for ' + solAmount + ' SOL',
        sourceUser: {
          address: event.purchase?.buyer,
        },
        nft: event.purchase?.nft,
      };
    case 'OfferEvent':
      solAmount = event.offer?.price / LAMPORTS_PER_SOL;
      return {
        ...base,
        content: 'Offered ' + solAmount + ' SOL',
        sourceUser: {
          address: event.offer?.buyer!,
          profile: null,
        },
        nft: event.offer?.nft,
      };
  }
}

export function FeedCardContainer(props: { anchorWallet: AnchorWallet; event: FeedEvent }) {
  const myFollowingList = [
    'FBNrpSJiM2FCTATss2N6gN9hxaNr6EqsLvrGBAi9cKW7',
    '2BNABAPHhYAxjpWRoKKnTsWT24jELuvadmZALvP6WvY4',
    'GJMCz6W1mcjZZD8jK5kNSPzKWDVTD4vHZCgm8kCdiVNS',
    '2fLigDC5sgXmcVMzQUz3vBqoHSj2yCbAJW1oYX8qbyoR',
  ]; // ideally gotten from a context hook or something

  const attrs = generateFeedCardAtributes(props.event, myFollowingList);
  console.log('Feed card', {
    event: props.event,
    attrs,
  });

  if (!attrs) return <div>Can not describe {props.event.__typename} </div>;

  if (props.event.__typename === 'FollowEvent')
    return <FollowCard attrs={attrs} anchorWallet={props.anchorWallet} event={props.event} />;

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

interface IFeedEvent {
  id: string;
  createdAt: string;
  type:
    | 'ListingEvent'
    | 'FollowEvent'
    | 'MintEvent'
    | 'PurchaseEvent'
    | 'OfferEvent'
    | 'AggregateEvent';
}

export interface AggregateEvent {
  id: string;
  __typename: 'AggregateEvent';
  createdAt: string;
  eventsAggregated: FeedEvent[];
}

export function FeedCard(props: { anchorWallet: AnchorWallet; event: FeedEvent | AggregateEvent }) {
  const myFollowingList = [
    'FBNrpSJiM2FCTATss2N6gN9hxaNr6EqsLvrGBAi9cKW7',
    '2BNABAPHhYAxjpWRoKKnTsWT24jELuvadmZALvP6WvY4',
    'GJMCz6W1mcjZZD8jK5kNSPzKWDVTD4vHZCgm8kCdiVNS',
    '2fLigDC5sgXmcVMzQUz3vBqoHSj2yCbAJW1oYX8qbyoR',
  ]; // ideally gotten from a context hook or something

  if (props.event.__typename === 'AggregateEvent') {
    return <div>and {props.event.eventsAggregated.length} similar events</div>;
  }

  const attrs = generateFeedCardAtributes(props.event, myFollowingList);
  console.log('Feed card', {
    event: props.event,
    attrs,
  });

  if (!attrs) return <div>Can not describe {props.event.__typename} </div>;

  if (props.event.__typename === 'FollowEvent')
    return <FollowCard attrs={attrs} anchorWallet={props.anchorWallet} event={props.event} />;

  if (!attrs.nft) return <div>Event is malformed</div>;

  return (
    <div className="group relative transition-all  hover:scale-[1.02] ">
      <Link href={'/nfts/' + attrs.nft.address} passHref>
        <a>
          <img
            className="aspect-square w-full rounded-lg "
            src={attrs.nft?.image}
            alt={attrs.nft?.name}
          />
        </a>
      </Link>
      <ShareMenu className="absolute top-4 right-4 " address={attrs.nft.address} />
      <div className="absolute bottom-0 left-0 right-0 flex items-center p-4 text-base">
        <FeedActionBanner event={props.event} />
      </div>
    </div>
  );
}

function FollowCard(props: {
  anchorWallet: AnchorWallet;
  event: FeedEvent;
  attrs: FeedCardAttributes;
}) {
  const attrs = props.attrs;
  const { connection } = useConnection();
  const walletConnectionPair = useMemo(
    () => ({ wallet: props.anchorWallet, connection }),
    [props.anchorWallet, connection]
  );

  if (!attrs) return <div>Not enough data</div>;

  return (
    <div
      className={classNames(
        'flex items-center rounded-full bg-gray-800 p-4 shadow-lg',
        false && 'hover:scale-[1.02]'
      )}
    >
      <ProfilePFP user={attrs.sourceUser} />
      <div className="ml-4">
        <div className="text-base font-semibold">
          {attrs.content}
          {/* Started following
              {attrs.toUser?.profile?.handle || shortenAddress(attrs.toUser.address)} */}
        </div>
        <div className="flex text-sm">
          <Link href={'/profiles/' + attrs.sourceUser.address + '/nfts'} passHref>
            <a>{attrs.sourceUser.profile?.handle || shortenAddress(attrs.sourceUser.address)}</a>
          </Link>
          <span>{DateTime.fromISO(attrs.createdAt).toRelative()}</span>
        </div>
      </div>
      <div className="ml-auto">
        <FollowUnfollowButton
          source="feed"
          walletConnectionPair={walletConnectionPair}
          toProfile={{
            pubkey: attrs.toUser!.address,
          }}
          type="Follow" // needs to be dynamic
        />
      </div>
    </div>
  );
}

function getHandle(u: User) {
  return (u.profile?.handle && '@' + u.profile?.handle) || shortenAddress(u.address);
}

const ProfileHandle = (props: { address: string }) => {
  const { data: twitterHandle } = useTwitterHandle(null, props.address);

  return <span>{(twitterHandle && '@' + twitterHandle) || shortenAddress(props.address)}</span>;
};

function FeedActionBanner(props: { event: FeedEvent }) {
  const attrs = generateFeedCardAtributes(props.event);

  if (!attrs?.sourceUser) return <div>Can not describe {props.event.__typename} </div>;

  return (
    <>
      <div className="flex w-full items-center rounded-full bg-gray-900/40 p-2 backdrop-blur-[200px] transition-all group-hover:bg-gray-900">
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
        <div className="ml-auto">
          <Button5 v="primary">Make offer</Button5>
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

function ProfilePFP({ user }: { user: User }) {
  // some of these hooks could probably be lifted up, but keeping it here for simplicity
  const { data: twitterHandle } = useTwitterHandle(null, user.address);
  const walletProfile = useWalletProfileQuery({
    variables: {
      handle: twitterHandle ?? '',
    },
  });

  return (
    <img
      className={classNames('rounded-full', 'h-10 w-10')}
      src={walletProfile.data?.profile?.profileImageUrlLowres || getPFPFromPublicKey(user.address)}
      alt={'profile picture for ' + user.profile?.handle || user.address}
    />
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

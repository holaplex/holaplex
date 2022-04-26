import { HOLAPLEX_MARKETPLACE_SUBDOMAIN } from '@/common/constants/marketplace';
import { shortenAddress } from '@/modules/utils/string';
import { Popover } from '@headlessui/react';
import { ShareIcon } from '@heroicons/react/outline';
import { AnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import classNames from 'classnames';
import { DateTime } from 'luxon';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { FeedEvent, useNftMarketplaceQuery } from 'src/graphql/indexerTypes';
import { Button5 } from '../elements/Button2';
import { FollowUnfollowButton } from '../elements/FollowUnfollowButton';
import Modal from '../elements/Modal';
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
      timestamp: string;
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
        name: string;
        image: string;
        description: string;
        creators: User[];
      } | null;
    }
  | undefined;

function generateFeedCardAtributes(event: FeedEvent): FeedCardAttributes {
  const base = {
    id: event.feedEventId,
    timestamp: event.createdAt,
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
        content: 'Followed ' + shortenAddress(event.connection?.to.address),
        sourceUser: {
          address: event.connection?.from.address,
          profile: null,
        },
        toUser: {
          address: event.connection?.to.address,
          profile: null,
        },
      };

    case 'MintEvent':
      return {
        ...base,
        content: 'Created',
        sourceUser: event.nft?.creators[0]!,
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
  }
}

export function FeedCard(props: { anchorWallet: AnchorWallet; event: FeedEvent }) {
  const attrs = generateFeedCardAtributes(props.event);
  console.log('Feed card', {
    event: props.event,
    attrs,
  });
  if (!attrs) return <div>Can not describe event</div>;

  if (props.event.__typename === 'FollowEvent')
    return <FollowCard attrs={attrs} anchorWallet={props.anchorWallet} event={props.event} />;

  if (!attrs.nft) return <div>Event is malformed</div>;

  return (
    <div className="group relative transition-all  hover:scale-[1.02] ">
      <img
        className="aspect-square w-full rounded-lg "
        src={attrs.nft?.image}
        alt={attrs.nft?.name}
      />
      <ShareMenu className="absolute top-4 right-4 " />
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
    <div className="flex items-center rounded-full bg-gray-800 p-4 shadow-lg ">
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
          <span>{DateTime.fromISO(attrs.timestamp).toRelative()}</span>
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

function FeedActionBanner(props: { event: FeedEvent }) {
  const attrs = generateFeedCardAtributes(props.event);

  if (!attrs?.sourceUser) return <div>Can not describe event</div>;

  return (
    <>
      <div className="flex w-full  rounded-full bg-gray-900/40 p-2 backdrop-blur-[200px] transition-all group-hover:bg-gray-900">
        <ProfilePFP user={attrs.sourceUser} />
        <div className="ml-2">
          <div className="text-base font-semibold">{attrs.content}</div>
          <div className="flex text-sm">
            {getHandle(attrs.sourceUser)} {DateTime.fromISO(attrs.timestamp).toRelative()}
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
  return user.profile?.pfp ? (
    <img
      className={classNames('rounded-full', 'h-10 w-10')}
      src={user.profile.pfp}
      alt={'profile picture for ' + user.profile.handle || user.address}
    />
  ) : (
    <div className={classNames('rounded-full bg-gray-700', 'h-10 w-10')}></div>
  );
}

function ShareMenu(props: { className: string }) {
  return (
    <div className={props.className}>
      <Popover className="relative">
        <Popover.Button className="rounded-full bg-gray-900/40 p-4 backdrop-blur-3xl group-hover:bg-gray-900">
          <ShareIcon className="h-4 w-4" />
        </Popover.Button>
        <Popover.Panel className="absolute z-10 w-64 -translate-y-32 transform space-y-8  bg-gray-900 px-4 text-white sm:px-0">
          <div>Share NFT to Twitter</div>
          <div>Copy link to NFT</div>
        </Popover.Panel>
      </Popover>
    </div>
  );
}

import React from 'react';

import { DateTime } from 'luxon';

import classNames from 'classnames';
import { Popover } from '@headlessui/react';
import { useState } from 'react';
import { Transition } from '@headlessui/react';

import { showFirstAndLastFour } from '@/modules/utils/string';
import { IFeedItem, IProfile } from '@/modules/feed/feed.interfaces';

export function generateContent(fi: IFeedItem) {
  const from = (fi.sourceUser || fi.nft?.creator) as IProfile;

  const fromDisplay = from.handle || showFirstAndLastFour(from.pubkey);
  const toDisplay = fi.toUser ? fi.toUser.handle || showFirstAndLastFour(fi.toUser.pubkey) : '';

  switch (fi.type) {
    case 'OUTBID':
      return `${fromDisplay} outbid ${toDisplay} on ${fi.nft?.name} with a bid of SOL${fi.solAmount}`;

    case 'BID_MADE':
      return `${fromDisplay} placed a bid of SOL${fi.solAmount} on ${fi.nft?.name} `;

    case 'SALE_PRIMARY':
      return `${fromDisplay} sold ${fi.nft?.name} for SOL${fi.solAmount}`;
    default:
      return 'No content for this activity';
  }
}

// function FeedItemContent() {

//   const from = (fi.sourceUser || fi.nft?.creator) as IProfile;

//   const fromDisplay = from.handle || showFirstAndLastFour(from.pubkey);
//   const toDisplay = fi.toUser ? fi.toUser.handle || showFirstAndLastFour(fi.toUser.pubkey) : '';

//   switch (fi.type) {
//     case 'OUTBID':
//       return `${fromDisplay} outbid ${toDisplay} on ${fi.nft?.name} with a bid of SOL${fi.solAmount}`;

//     case 'BID_MADE':
//       return `${fromDisplay} placed a bid of SOL${fi.solAmount} on ${fi.nft?.name} `;

//     case 'SALE_PRIMARY':
//       return `${fromDisplay} sold ${fi.nft?.name} for SOL${fi.solAmount}`;
//     default:
//       return 'No content for this activity';
//   }

// }

export default function FeedItem(props: { fi: IFeedItem }) {
  const fi = props.fi;
  const from = (fi.sourceUser || fi.nft?.creator) as IProfile;

  const content = generateContent(fi);
  return (
    <div>
      <div className="mb-6 flex items-center text-base">
        <ProfilePFP profile={from} size="md" />
        <div className="ml-6">
          <div className="text-gray-300">{content}</div>
          <div className="mt-2 text-sm text-gray-500">
            {DateTime.fromISO(fi.timestamp).toRelative()}
          </div>
        </div>
      </div>
      {fi.nft && (
        <>
          <img
            className="aspect-square w-full rounded-lg "
            src={fi.nft?.imageURL}
            alt={fi.nft?.name}
          />
          {fi.nft.creator && (
            <div className="mt-6 flex justify-between">
              <div className="flex items-center text-base">
                <ProfilePFP profile={fi.nft.creator} />
                <div className="ml-2">
                  {fi.nft.creator.handle || showFirstAndLastFour(fi.nft.creator.pubkey)}
                </div>
              </div>
              <ShareMenu />
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ShareMenu() {
  return (
    <Popover className="relative">
      <Popover.Button>Share</Popover.Button>
      <Popover.Panel className="absolute z-10 w-64 -translate-y-32 transform space-y-8  bg-gray-900 px-4 text-white sm:px-0">
        <div>Share NFT to Twitter</div>
        <div>Copy link to NFT</div>
      </Popover.Panel>
      {/* <Transition
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
      </Transition> */}
    </Popover>
  );
}

function ProfilePFP({ profile, size = 'sm' }: { profile: IProfile; size?: 'sm' | 'md' }) {
  return profile.pfp ? (
    <img
      className={classNames('rounded-full', size === 'sm' ? 'h-6 w-6' : 'h-16 w-16')}
      src={profile.pfp}
      alt={'profile picture for ' + profile.handle || profile.pubkey}
    />
  ) : (
    <div
      className={classNames('rounded-full bg-gray-700', size === 'sm' ? 'h-8 w-8' : 'h-16 w-16')}
    ></div>
  );
}

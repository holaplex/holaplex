import React from 'react';
import { showFirstAndLastFour } from '../utils/string';
import { IFeedItem, IProfile } from './feed.interfaces';
import { DateTime } from 'luxon';
import Image from 'next/image';
import classNames from 'classnames';
import { Popover } from '@headlessui/react';
import { useState } from 'react';
import { Transition } from '@headlessui/react';
import { generateContent } from './feedUtils';

export default function FeedItem(props: { fi: IFeedItem }) {
  const fi = props.fi;
  const from = (fi.from || fi.nft?.creator) as IProfile;

  const content = generateContent(fi);
  return (
    <div>
      <div className="flex">
        <ProfilePFP profile={from} size="md" />
        <div>
          <div>{content}</div>
          <div> {DateTime.fromISO(fi.timestamp).toRelative()} </div>
        </div>
      </div>
      {fi.nft && (
        <>
          <Image
            className="max-w-fit"
            width={600}
            height={600}
            src={fi.nft?.imageURL}
            alt={fi.nft?.name}
          />
          {fi.nft.creator && (
            <div className="flex justify-between">
              <div className="flex">
                <ProfilePFP profile={fi.nft.creator} />
                <div>{fi.nft.creator.handle || showFirstAndLastFour(fi.nft.creator.pubkey)}</div>
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
      className={classNames('rounded-full', size === 'sm' ? 'h-8 w-8' : 'h-16 w-16')}
      src={profile.pfp}
      alt={'profile picture for ' + profile.handle || profile.pubkey}
    />
  ) : (
    <div
      className={classNames('rounded-full bg-gray-700', size === 'sm' ? 'h-8 w-8' : 'h-16 w-16')}
    ></div>
  );
}

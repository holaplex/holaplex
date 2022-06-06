import { imgOpt } from '@/common/utils';
import classNames from 'classnames';
import React from 'react';

interface ActivityCardProps {
  thumbnailType: 'nft' | 'pfp' | 'collection';
  image: string;
  content: JSX.Element;
  action: JSX.Element;
}

/*
Used in
- "Old auction" card
- offers
- feed?

supported actions
- view
- buy
- offer
- update offer
- accept offer
- follow 
- unfolow


ideal structure
offers.map(o => <ActivityCard>
    <OfferAction />
    <>)


activity types
- offer made
- offcer accepted
- offer updated
- buy now
- sold
- follow
- unfollow
- created
*/

export default function ActivityCard2(props: ActivityCardProps) {
  return (
    <div className="relative flex flex-wrap items-center  rounded-md border border-gray-800 p-4 font-sans text-base transition-transform duration-300 hover:scale-[1.02] md:flex-nowrap">
      <div className="flex items-center">
        <div
          className={classNames(
            'relative mr-4 flex  h-20 w-20  flex-shrink-0 items-center text-gray-300',
            props.thumbnailType === 'nft' ? 'rounded-md' : 'rounded-full'
          )}
        >
          {props.image && (
            <img
              className={
                props.thumbnailType === 'nft'
                  ? 'aspect-square rounded-md object-cover'
                  : 'aspect-square rounded-full object-cover'
              }
              src={imgOpt(props.image, 200)!}
              alt="activity thumbnail"
            />
          )}
        </div>
        <div>
          {/* <ActivityCardContent activity={props.activity} isYou={isYou} /> */}
          <div>Content</div>
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
        <HolaButton version="ghost" onClick={() => activitySelected()}>
          View
        </HolaButton>
      </a>
    </div>
  );
}

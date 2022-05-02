import SocialLinks from '@/common/components/elements/SocialLinks';
import { MyActivityList } from '@/common/components/feed/MyActivityList';
import WhoToFollowList from '@/common/components/feed/WhoToFollowList';
import { SmallFooter } from '@/common/components/home/Footer';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Tab } from '@headlessui/react';
import { ProfileHandle, ProfilePFP } from '@/common/components/feed/FeedCard';

type FeedType = 'Following' | 'Discovery';
const Feeds: FeedType[] = ['Following', 'Discovery'];

const TEST_FEEDS = [
  {
    address: 'NWswq7QR7E1i1jkdkddHQUFtRPihqBmJ7MfnMCcUf4H', // kris
    handle: '@kristianeboe',
  },
  {
    address: 'GJMCz6W1mcjZZD8jK5kNSPzKWDVTD4vHZCgm8kCdiVNS', // kayla
    handle: '@itskay_k',
  },
  {
    address: '7oUUEdptZnZVhSet4qobU9PtpPfiNUEJ8ftPnrC6YEaa', // dan
    handle: '@dandelzzz',
  },
  {
    address: 'FeikG7Kui7zw8srzShhrPv2TJgwAn61GU7m8xmaK9GnW', // kevin
    handle: '@misterkevin_rs',
  },
  {
    address: '2fLigDC5sgXmcVMzQUz3vBqoHSj2yCbAJW1oYX8qbyoR', // Belle
    handle: '@belle__sol',
  },
  {
    address: '7r8oBPs3vNqgqEG8gnyPWUPgWuScxXyUxtmoLd1bg17F', // Alex
    handle: '@afkehaya',
  },
];

export default function FeedLayout({ children }: { children: any }) {
  // const router = useRouter();
  // const feedTabSelected = !router.pathname.includes('discovery');

  // const Tab = (props: { url: string; selected: boolean; title: string }) => (
  //   <Link href={props.url} passHref>
  //     <a
  //       className={classNames(
  //         'w-full  py-2.5 text-center text-sm font-medium text-white ',
  //         props.selected ? 'border-b border-white' : 'text-gray-300  hover:text-white'
  //       )}
  //     >
  //       {props.title}
  //     </a>
  //   </Link>
  // );

  return (
    <div className="container mx-auto mt-20 px-6 pb-20  ">
      <div className="mt-12 flex justify-between">
        <div className="w-full max-w-2xl">
          {/* <div className="flex space-x-1   p-1">
            <Tab title={'Feed'} selected={feedTabSelected} url="/feed" />
            <Tab title={'Discovery'} selected={!feedTabSelected} url="/feed/discovery" />
          </div> */}
          {children}
        </div>
        <div className="sticky top-10 hidden h-fit w-full max-w-md space-y-7 xl:block ">
          <WhoToFollowList />
          {/* <MyActivityList /> */}
          <div>
            <div className="mb-6 flex items-center justify-between border-b border-gray-800 pb-4">
              <h3 className="m-0 text-base font-medium text-white">
                Test feeds (click to view their feeds){' '}
              </h3>
            </div>

            <div className="space-y-4">
              {TEST_FEEDS.map((u) => (
                // <FollowListItem key={p.handle} profile={p} />
                <Link passHref key={u.address} href={'/feed?address=' + u.address}>
                  <a className="flex items-center space-x-4">
                    <ProfilePFP user={u} />
                    <span>{u.handle}</span>
                  </a>
                </Link>
              ))}
            </div>
          </div>
          <div className="relative  py-10 ">
            <div className="absolute  inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-800" />
            </div>
          </div>
          <SmallFooter />
        </div>
        <BackToTopBtn />
      </div>
    </div>
  );
}

function BackToTopBtn() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
      className={classNames(
        'fixed right-8 bottom-8 rounded-full bg-gray-900 p-4',
        scrollY === 0 && 'hidden'
      )}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.99935 12.8332V1.1665M6.99935 1.1665L1.16602 6.99984M6.99935 1.1665L12.8327 6.99984"
          stroke="white"
          strokeWidth="1.67"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

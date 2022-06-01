import WhoToFollowList from '@/common/components/feed/WhoToFollowList';
import Footer, { SmallFooter } from '@/common/components/home/Footer';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { EmptyStateCTA } from '@/common/components/feed/EmptyStateCTA';
import {
  useAllConnectionsFromLazyQuery, useWhoToFollowQuery,
} from 'src/graphql/indexerTypes';
import { User } from '@/common/components/feed/feed.utils';

export default function FeedLayout({ children }: { children: any }) {
  // Please don't remove the commented out code about the tab structure yet, it might be used soon // Kris

  /*   const router = useRouter();
  const feedTabSelected = !router.pathname.includes('discovery');

  const Tab = (props: { url: string; selected: boolean; title: string }) => (
    <Link href={props.url} passHref>
      <a
        className={classNames(
          'w-full  py-2.5 text-center text-sm font-medium text-white ',
          props.selected ? 'border-b border-white' : 'text-gray-300  hover:text-white'
        )}
      >
        {props.title}
      </a>
    </Link>
  ); */
  const anchorWallet = useAnchorWallet();
  const [showConnectCTA, setShowConnectCTA] = useState(false);

  const [query, { data }] = useAllConnectionsFromLazyQuery({
    variables: {
      from: anchorWallet?.publicKey.toBase58(),
    },
  });

  const myFollowingList: string[] | undefined = data?.connections.map((c) => c.to.address);

  const {data: whoToFollowData} = useWhoToFollowQuery({variables: {wallet: anchorWallet?.publicKey, limit: 25}});
  const profilesToFollow: User[] = (whoToFollowData?.followWallets || []).map(u => ({address: u.address, profile: {handle: u.profile?.handle, profileImageUrl: u.profile?.profileImageUrlLowres}}));

  useEffect(() => {
    if (!anchorWallet) {
      setTimeout(() => {
        setShowConnectCTA((() => !!anchorWallet)());
      }, 2000);
    } else {
      query();
    }
  }, [anchorWallet]);

  if (showConnectCTA) {
    return (
      <div className=" -mt-32 h-full max-h-screen">
        <div className="container mx-auto -mt-12 -mb-80 flex h-full flex-col items-center justify-center px-6 xl:px-44">
          <EmptyStateCTA
            header="Connect your wallet to view your feed"
            body="Follow your favorite collectors and creators, and get your own personalized feed of activities across the Holaplex ecosystem."
          />
        </div>
        <Footer />
      </div>
    );
  }
  if (!anchorWallet) return null;

  return (
    <div className="container mx-auto mt-10 px-6 pb-20  xl:px-44  ">
      <div className="mt-12 flex justify-between">
        <div className="mx-auto w-full  sm:w-[600px] xl:mx-0 ">
          {children}
        </div>
        <div className="sticky top-10 ml-20 hidden h-fit w-full max-w-sm  xl:block ">
          <WhoToFollowList myFollowingList={myFollowingList} profilesToFollow={profilesToFollow}/>
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

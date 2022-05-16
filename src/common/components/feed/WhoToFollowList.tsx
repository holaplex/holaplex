import { IProfile } from '@/modules/feed/feed.interfaces';
import { AnchorWallet, useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useWhoToFollowQuery, WhoToFollowQuery } from 'src/graphql/indexerTypes';
import { FollowUnfollowButton } from '../elements/FollowUnfollowButton';
import { getHandle, shuffleArray, User } from './feed.utils';
import { ProfilePFP } from './FeedCard';

function FollowListItem({
  user,
  ...props
}: {
  user: User;
  walletConnectionPair: {
    wallet: AnchorWallet;
    connection: Connection;
  };
  myFollowingList: string[];
}) {
  return (
    <div className="flex justify-between">
      <div className="flex items-center">
        <div className="mr-4">
          {/* {user.profile?.pfp ? (
            <img
              className="h-8 w-8 rounded-full"
              src={user.profile?.pfp}
              alt={'profile picture for ' + user.profile.handle || user.address}
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-gray-700"></div>
          )} */}
          <ProfilePFP user={user} />
        </div>
        <Link href={'/profiles/' + user.address + '/nfts'} passHref>
          <a>{getHandle(user)}</a>
        </Link>
      </div>

      <FollowUnfollowButton
        source="whotofollow"
        walletConnectionPair={props.walletConnectionPair}
        toProfile={{
          address: user.address,
        }}
        type={props.myFollowingList.includes(user.address) ? 'Unfollow' : 'Follow'} // needs to be dynamic
      />
    </div>
  );
}

export default function WhoToFollowList(props: { myFollowingList?: string[] }) {
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();
  const walletConnectionPair = useMemo(
    () => ({ wallet: anchorWallet!, connection }),
    [anchorWallet, connection]
  );

  /*   const { data } = useWhoToFollowQuery(); */

  const [topProfilesToFollow, setTopProfilesToFollow] = useState<User[]>(
    // INFLUENTIAL_WALLETS.slice(0, 10)
    []
  );
  const [currentFollowingList, setCurrentFollowingList] = useState<string[]>([]);

  // initialize based on who you already follow
  useEffect(() => {
    if (props.myFollowingList && !topProfilesToFollow.length) {
      setTopProfilesToFollow(
        INFLUENTIAL_WALLETS.filter((u) => !props.myFollowingList?.includes(u.address)).splice(0, 5)
      );
      setCurrentFollowingList(props.myFollowingList);
    }
  }, [props.myFollowingList]);

  // update
  useEffect(() => {
    if (
      topProfilesToFollow.length &&
      props.myFollowingList &&
      props.myFollowingList.length > 0 &&
      props.myFollowingList.length !== currentFollowingList.length
    ) {
      const newWalletFollowed = props.myFollowingList.find(
        (address) => !currentFollowingList.includes(address)
      );
      if (newWalletFollowed) {
        const topProfileIndexToChange = topProfilesToFollow.findIndex(
          (u) => u.address === newWalletFollowed
        );
        if (topProfileIndexToChange !== -1) {
          setTopProfilesToFollow(
            [
              ...topProfilesToFollow.slice(0, topProfileIndexToChange),
              INFLUENTIAL_WALLETS.filter(
                (u) =>
                  !topProfilesToFollow.some((tu) => tu.address === u.address) &&
                  !props.myFollowingList?.includes(u.address)
              ).splice(0, 1)[0],
              ...topProfilesToFollow.slice(topProfileIndexToChange + 1),
            ].filter((u) => u)
            // filter to handle case when INFLUENTIAL_WALLETS is empty
          );
        }
      }
      setCurrentFollowingList(props.myFollowingList);
    }
  }, [props.myFollowingList?.length]);

  const myFollowingList = props.myFollowingList || [];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between border-b border-gray-800 pb-4">
        <h3 className="m-0 text-base font-medium text-white">Who to follow</h3>
        {/* <Link href={'/feed/whotofollow'} passHref>
          <a>
            <button className="text-base text-gray-300">See more</button>
          </a>
        </Link> */}
      </div>
      <div className="space-y-6">
        {topProfilesToFollow.length === 0 && (
          <>
            <LoadingFollowCard />
            <LoadingFollowCard />
            <LoadingFollowCard />
            <LoadingFollowCard />
            <LoadingFollowCard />
            <LoadingFollowCard />
            <LoadingFollowCard />
          </>
        )}

        {anchorWallet &&
          topProfilesToFollow.map((u) => (
            <FollowListItem
              key={u.address}
              user={u}
              walletConnectionPair={walletConnectionPair}
              myFollowingList={myFollowingList}
            />
          ))}
        {!anchorWallet && myFollowingList && <div>Connect wallet to see suggestions</div>}
      </div>
    </div>
  );
}

const LoadingFollowCard = () => (
  <div className="flex animate-pulse justify-between">
    <div className="flex items-center">
      <div className="mr-4">
        <div className={`h-10 w-10 rounded-full bg-gray-800`} />
      </div>
      <div className={`h-10 w-40 rounded-full bg-gray-800`} />
    </div>

    <div className={` h-10 w-28 rounded-full bg-gray-800`} />
  </div>
);

export const INFLUENTIAL_WALLETS: /* Partial<WhoToFollowQuery['followWallets']>  */ User[] =
  shuffleArray([
    {
      address: 'NWswq7QR7E1i1jkdkddHQUFtRPihqBmJ7MfnMCcUf4H',
      profile: {
        handle: 'kristianeboe',
        profileImageUrl: '',
      },
      /*   bids: [],
    nftCounts: {
      listed: 0,
      offered: 0,
      owned: 0,
    },
    connectionCounts: {
      fromCount: 0,
      toCount: 0,
    }, */
    },
    {
      address: '3XzWJgu5WEU3GV3mHkWKDYtMXVybUhGeFt7N6uwkcezF',
      profile: {
        handle: 'ClassicScuba',
      },
    },
    {
      address: '2BNABAPHhYAxjpWRoKKnTsWT24jELuvadmZALvP6WvY4',
      profile: {
        handle: 'ghost_fried',
      },
    },
    {
      address: 'DCFWUYqK1iwGzSD3w6SzpwH77GgmbbVX3E2QRtN1qBrj',
      profile: {
        handle: 'notjohnlesstudio',
      },
    },
    {
      address: 'x31BQteSUcoLcatn57pUPh1ATqDkGSBti4KpnXbqjMq',
      profile: {
        handle: 'b2kdaman',
      },
    },
    {
      address: '14kVL6sWSc4oX9rwcJU7aMHMLMjsEfpXcAJf68kmsMeP',
      profile: {
        handle: '64jooski',
      },
    },
    {
      address: '3StkrkMEmdiu9nER5qM3fNR1fCMdawUhGsihF2UkXrPP',
      profile: {
        handle: 'earlyishadopter',
      },
    },
    {
      address: 'DgzWqku67fPeuWgmyZbNa7U7yicKRhbjM7nB86Yx2ojQ',
      profile: {
        handle: 'erhancrypto',
      },
    },
    {
      address: 'Dz3BJenPAMziCBhJFGwUxvu3qhMUuLch8NjoZdfP9xsa',
      profile: {
        handle: 'js',
      },
    },
    {
      address: 'AwiRcagxnT8NLnJeS8ScVcq2Y9f5VeJUfyfR5AXmVFfh',
      profile: {
        handle: 'N8Solomon',
      },
    },
    {
      address: 'AXXRH6NVXjUNxi6GvVWV4Pp6q7k9xkqeqHhRx8sW41TX',
      profile: {
        handle: 'Pixeltoy',
      },
    },
    {
      address: 'CPkXvmoLnru2UX9JcDXLykKkGyTCCYJ67LVZdYahASyh',
      profile: {
        // handle: 'Ted // SlimeyOctopus',
      },
    },
    {
      address: '79j2yWfDHnAU3Aq4yfoTcE9KCHCDo2m54aL4te67683Q',
      profile: {
        handle: 'TheObserverNft',
      },
    },
    {
      address: 'Fh2rUc2CrMTp6H7t1CGnG4aXhWn7BzPPQBU2KkgR4jeh',
      profile: {
        handle: 'twxcrypto',
      },
    },
    {
      address: 'gNEt8EeWqdcSpebQXZ8YVnBC9k5yKp2WGvnA9HR8RzQ',
      profile: {
        handle: 'wgarrettdavis',
      },
    },
    {
      address: 'zenom3SnXK6k2UJm73jRQ1n8U7KkLPrTypDatKjGxoL',
      profile: {
        handle: 'zen0m',
      },
    },
    {
      address: 'Er6QJPusC1JsUqevTjFKXtYHbgCtJkyo1DNjEBWevWut',
      profile: {
        handle: '0xbustos',
      },
    },
    {
      address: 'HLSgM1a7wSufVwe1NrPPR22ynY2aPsH8a1XQfqFsQiqY',
      profile: {
        handle: '0xCelon',
      },
    },
    {
      address: 'BjSaYdgdWtBNXGJmy6cuTzxYzLcxvn4Anw6yrWsgKdNm',
      profile: {
        handle: 'PrimitiveMoney',
      },
    },
    {
      address: '8t6BxNBe7pM8YwvG4JUQxi1W9PYfuphrYcUiJF99oWsP',
      profile: {
        handle: 'RainneN23',
      },
    },
    {
      address: '4ZjYSCH3Sib9iMSM3QN2sL2kwxNcXG2P4XCemSC2hsyb',
      profile: {
        handle: 'TheOnlyNom',
      },
    },
    {
      address: 'GcpdC1iUtfiQ48B6dn7bcM2Ax13R6TDom65jQJiTD18G',
      profile: {
        handle: 'adam_ape_',
      },
    },
    {
      address: 'xYwSUQv7DX62XGo4XXFAQRSTwtS1NrWz8rifR7Gppeg',
      profile: {
        handle: 'Crypt0xG',
      },
    },
    {
      address: 'A1Fk3zhtamLixGStRFc4eBd3pVodoFrNRbVFCaPaPJBu',
      profile: {
        handle: 'itsMcNatt',
      },
    },
    {
      address: 'B3jtSCpXQpMZR5r5m87854bgMj5veHwz9idjd22eVrP7',
      profile: {
        handle: 'kknorikami',
      },
    },
    {
      address: 'GpnKen3QMaLc1CzFsoy8UbcbPwEXRXb5k2qTkTcUa3RX',
      profile: {
        handle: 'MattSolana',
      },
    },
    {
      address: 'H4dfSserFhYBswmPMF3FdYEbu4aj1AQt7RSXRyVqVjaS',
      profile: {
        handle: 'poohaus',
      },
    },
    {
      address: '4Jb3dS76hxcBXKZDkwx3KC4NSMXoTKsyXfwW18apS4vZ',
      profile: {
        handle: 'S0Ltoshi',
      },
    },
    {
      address: 'yTM5APEbWb1GBBtgsjzTF6ZYw5pWxqCr7qKykWW7qLS',
      profile: {
        handle: 'Solchemist',
      },
    },
    {
      address: '2TKEfKKLreKYykZMCKiFMYhhkKFxajfSBeKNZ8rFa6qt',
      profile: {
        // handle: 'Good_Brice_',
      },
    },
    {
      address: 'CsxZxjL19pJ3DM4yyDZDePgCWj6m7Lm9htwHggBbgP1r',
      profile: {
        handle: 'howl33333',
      },
    },
    {
      address: '57DsAWRijeENrhb4RdKiLjKzLF1V8f1J2D8mCNvGMSPu',
      profile: {
        // handle: 'quincy_sol',
      },
    },
    {
      address: 'DWPpeotxT2Q1m1BDzuycQktDe6VnVejLiPWsjfwG6Nb7',
      profile: {
        handle: 'Sunless_1',
      },
    },
  ]);

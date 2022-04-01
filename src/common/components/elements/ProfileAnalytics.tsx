import { FC, useMemo } from 'react';
import { IProfile } from '@/modules/feed/feed.interfaces';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { Bid, useProfileAnalyticsQuery } from '../../../graphql/indexerTypes';
import { lamportToSolIsh } from './ListingPreview';
import { SolIcon } from './Price';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

type ProfileAnalyticsProps = {
  profile: IProfile;
};

type SolTextHelperProps = {
  sol?: number;
};

type AnalyticNumberProps = {
  num?: number;
};

const SolTextHelper: FC<SolTextHelperProps> = ({ sol }) =>
  sol ? (
    <b className="ml-1 inline-flex items-center">
      <SolIcon className="mr-1 h-3 w-3" stroke="white" /> {sol / LAMPORTS_PER_SOL}
    </b>
  ) : null;

const AnalyticNumber: FC<AnalyticNumberProps> = ({ num }) => {
  if (!num) {
    return <span className={`pl-1 font-bold text-gray-200`}>0</span>;
  }
  return <span className={`pl-1 font-bold text-gray-200`}>{num}</span>;
};

const calcTotalBids = (bids: Bid[]) => {
  let bidTotal = 0;
  if (bids) {
    bids.map((bid) => {
      bidTotal = bidTotal + Number(bid.lastBidAmount);
    });
  }
  return bidTotal;
};

const calcWonBids = (bids: Bid[]) => {
  let wonBids = 0;
  let lostBids = 0;
  if (bids) {
    bids.map((bid) => {
      const listing = bid.listing;
      const hasHighestBid = listing?.bids[0].bidderAddress === bid.bidderAddress;
      if (hasHighestBid) {
        wonBids += Number(bid.lastBidAmount);
      } else {
        lostBids += Number(bid.lastBidAmount);
      }
    });
  }
  return {
    wonBids,
    lostBids,
  };
};

export const ProfileAnalytics: FC<ProfileAnalyticsProps> = ({ profile, ...rest }) => {
  const wallet = useAnchorWallet();

  const { data, loading } = useProfileAnalyticsQuery({
    variables: {
      address: profile.pubkey,
    },
  });

  const totalBids = useMemo(() => {
    return calcTotalBids(data?.wallet?.bids as Bid[]);
  }, [data?.wallet?.bids]);

  const { wonBids, lostBids } = useMemo(() => {
    return calcWonBids(data?.wallet?.bids as Bid[]);
  }, [data?.wallet?.bids]);

  if (!wallet) {
    return null;
  }
  return (
    <div className={`mt-2 mr-2 border-t-2 border-gray-500 pt-2`}>
      <div className={`xs:grid-cols-3 grid grid-cols-2 gap-1 md:grid-cols-2`}>
        <div className={`inline-flex items-center text-xs text-gray-200`}>
          Total Bids: <AnalyticNumber num={data?.wallet?.bids.length} />
          {}
        </div>
        <div className={`inline-flex items-center text-xs text-gray-200`}>
          Bid Volume: <SolTextHelper sol={totalBids} />
        </div>
        <div className={`inline-flex items-center text-xs text-gray-200`}>
          Lost Bids: <SolTextHelper sol={lostBids} />
        </div>
        <div className={`inline-flex items-center text-xs text-gray-200`}>
          Total Won Bids: <SolTextHelper sol={wonBids} />
        </div>
      </div>
    </div>
  );
};

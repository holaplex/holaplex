import React, { FC } from 'react';
import { Nft, Marketplace } from '@/types/types';
import { HOLAPLEX_MARKETPLACE_ADDRESS } from '../../constants/marketplace';
import { useWallet } from '@solana/wallet-adapter-react';
import { ApolloQueryResult, OperationVariables } from '@apollo/client';
import { None } from './OfferForm';

interface BuySellFormProps {
  nft: Nft;
  marketplace: Marketplace;
  refetch: (
    variables?: Partial<OperationVariables> | undefined
  ) => Promise<ApolloQueryResult<None>>;
}

// TODO: WIP move things to here once all methods are implemented and clean everything up
// TODO: Don't forget to add analytics as well useAnalytics()

const BuySellForm: FC<BuySellFormProps> = ({ nft, marketplace }) => {
  const { publicKey } = useWallet();

  if (!nft || !marketplace) {
    return null;
  }

  // listings
  const defaultListing = nft?.listings.find(
    (listing) => listing.auctionHouse.toString() === HOLAPLEX_MARKETPLACE_ADDRESS
  );
  const hasDefaultListing = Boolean(defaultListing);

  // offers
  const offer = nft?.offers.find((offer) => offer.buyer === publicKey?.toBase58());
  const hasAddedOffer = Boolean(offer);
  const offers = nft?.offers;
  const topOffer = offers?.slice()?.sort((a, b) => Number(a.price) - Number(b.price))[0];
  const hasTopOffer = Boolean(topOffer);

  // nft state
  const isOwner = Boolean(nft?.owner?.address === publicKey?.toBase58());

  return (
    <div className={`flex flex-col rounded-md bg-gray-800 p-6`}>
      {hasDefaultListing ? <div></div> : <div></div>}
    </div>
  );
};

export default BuySellForm;

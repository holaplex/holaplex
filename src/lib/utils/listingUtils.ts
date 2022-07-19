import { Listing } from '@/modules/indexer';
import { equals, ifElse, is, pipe, prop } from 'ramda';

export const isAuction = pipe(prop('endsAt'), is(String));

export const isSecondarySale = pipe((item) => item.items[0]?.primarySaleHappened == true);

// const currentListingPrice = ifElse(
//   isAuction,
//   ifElse(pipe(prop('totalUncancelledBids'), equals(0)), prop('priceFloor'), prop('highestBid')),
//   prop('instantSalePrice')
// );

export function getListingPrice(listing: Listing) {
  return (
    (listing.highestBid
      ? listing.highestBid
      : listing.priceFloor
      ? listing.priceFloor
      : listing.instantSalePrice) || 0
  );
}

function getCurrentListingPrice(listing: Listing) {}

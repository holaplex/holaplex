import { Listing } from '@/common/components/elements/ListingPreview';
import { toast } from 'react-toastify';
import staticListings from 'fixtures/listings.json';
import { DateTime } from 'luxon';

const storeBlacklist: string[] = [
  'xperienceproject', // explicit
  'testme',
  'bwauctions',
  'nu9ve',
  'sublimemantis',
  'max-test',
  'max-test-2',
  'max-test-4',
  'max-test-5',
  'mysubdomain',
  '123123123',
  'sssss',
  'solanamonkeybusiness',
];

// will eventually be moved to server
function initialListingFilter(listing: Listing) {
  if (
    listing.ended || // past listings
    (listing.endsAt &&
      DateTime.fromFormat(listing.endsAt, 'yyyy-MM-dd hh:mm:ss').toMillis() < Date.now()) || // auctions that ended, but .ended flag not flipped
    (!listing.endsAt && listing.lastBidTime) || // remove instant buys that have ended
    (listing.endsAt &&
      DateTime.fromFormat(listing.endsAt, 'yyyy-MM-dd hh:mm:ss').toMillis() - Date.now() >
        86400000 * 31) || // listings more than 31 days in the future
    (listing?.priceFloor || 0) * 0.000000001 > 2000 ||
    storeBlacklist.includes(listing.subdomain)
  ) {
    return false;
  }

  return true;
}

export async function callMetaplexIndexerRPC(
  method: 'getListings' | 'getFeaturedListings',
  params: string[] = []
): Promise<Listing[]> {
  try {
    // just a hack while we wait for the rpc endpont
    if (method === 'getFeaturedListings')
      return (
        staticListings.result
          .filter((l) => initialListingFilter(l) && l.totalUncancelledBids)
          // @ts-ignore
          .sort((a, b) => b.totalUncancelledBids - a.totalUncancelledBids)
          .slice(0, 4)
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      );

    const indexerURL = process.env.NEXT_PUBLIC_INDEXER_RPC_URL as string;
    const res = await fetch(indexerURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method,
        params,
        id: 1337,
      }),
    });

    const json: { id: string; result: Listing[] } = await res.json();
    // console.log(method, json.result.length, 'from rpc', indexerURL);

    const listings = json.result.filter((l) => initialListingFilter(l));
    // console.log('after filters', listings.length, 'from rpc', indexerURL);
    return listings;
  } catch (error) {
    console.error(error);
    toast('There was an error fetching listing data, please try again');
    const listings = staticListings.result.filter((l) => initialListingFilter(l));

    return listings;
  }
}

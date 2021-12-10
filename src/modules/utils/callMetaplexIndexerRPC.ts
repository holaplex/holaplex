import { Listing } from '@/common/components/elements/ListingPreview';
import { toast } from 'react-toastify';
import staticListings from 'fixtures/listings.json';

function initialListingFilter(listing: Listing) {
  if (
    listing.ended || // past listings
    (listing.ends_at && new Date(listing.ends_at).getTime() < Date.now()) || // auctions that ended, but .ended flag not flipped
    (!listing.ends_at && listing.last_bid) || // remove instant buys that have ended
    (listing.ends_at && new Date(listing.ends_at).getTime() - Date.now() > 86400000 * 31) || // listings more than 31 days in the future
    (listing?.price_floor || 0) * 0.000000001 > 2000
  ) {
    return false;
  }

  return true;
}

export async function callMetaplexIndexerRPC(
  method: string,
  params: string[] = []
): Promise<Listing[]> {
  try {
    const indexerURL = 'https://metaplex-indexer-staging.herokuapp.com/' || 'http://localhost:4000';
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

    const listings = json.result.filter((l) => initialListingFilter(l));

    return listings;

    // just catching everything below instead
    // if (res.ok) {
    //   const json = await res.json();
    // }
  } catch (error) {
    console.error(error);
    toast('There was an error fetching listing data, please try again');
    const listings = staticListings.result.filter((l) => initialListingFilter(l));

    return listings;
    // throw new Error('RPC error');
  }
}

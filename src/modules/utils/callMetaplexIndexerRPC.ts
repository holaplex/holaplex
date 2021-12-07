import { Listing } from '@/common/components/elements/ListingPreview';
import { toast } from 'react-toastify';

export async function callMetaplexIndexerRPC(
  method: string,
  params: string[] = []
): Promise<Listing[]> {
  try {
    const res = await fetch('http://localhost:4000', {
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

    const json = await res.json();
    console.log('rpc json', {
      json,
    });

    return json.result;

    // just catching everything below instead
    // if (res.ok) {
    //   const json = await res.json();
    // }
  } catch (error) {
    console.error(error);
    toast('There was an error fetching listing data, please try again');
    return [];
    // throw new Error('RPC error');
  }
}

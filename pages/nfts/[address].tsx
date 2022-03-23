import React, { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useNftPageLazyQuery } from '../../src/graphql/indexerTypes';
// import Bugsnag from '@bugsnag/js';

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      address: context?.params?.address ?? '',
    },
  };
};

export default function NftByAddress({ address }: { address: string }) {
  const [queryNft, nftResponse] = useNftPageLazyQuery();

  const nft = nftResponse?.data?.nft;
  console.log('nft', nft);

  useEffect(() => {
    if (!address) return;

    try {
      queryNft({
        variables: {
          address,
        },
      });
    } catch (error: any) {
      console.error(error);
      // Bugsnag.notify(error);
    }
  }, [address, queryNft]);

  return (
    <div>
      <pre>{JSON.stringify(nft, null, 2)}</pre>
    </div>
  );
}

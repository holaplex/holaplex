import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Modal from 'src/components/Modal';
import OfferForm from '@/components/OfferForm';
import BlurPage from '@/views/nfts/BlurPage';
import { useNftMarketplaceQuery } from '@/graphql/indexerTypes';
import { Nft, Marketplace } from '@holaplex/marketplace-js-sdk';

import Custom404 from '../../../404';
import NftByAddress from '../../[address]';
import { HOLAPLEX_MARKETPLACE_SUBDOMAIN } from 'src/views/_global/holaplexConstants';
import NFTPreview from '@/components/NFTPreview';
import { useWallet } from '@solana/wallet-adapter-react';

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      address: context?.params?.address ?? '',
    },
  };
};

const NewNFTOffer = ({ address }: { address: string }) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  const { data, loading, called, refetch } = useNftMarketplaceQuery({
    fetchPolicy: `no-cache`,
    variables: {
      subdomain: HOLAPLEX_MARKETPLACE_SUBDOMAIN,
      address: address,
    },
  });

  const { publicKey } = useWallet();

  const nft = data?.nft;
  const marketplace = data?.marketplace;
  const isOwner = publicKey ? Boolean(nft?.owner?.address === publicKey?.toBase58()) : false;

  const router = useRouter();

  const goBack = () => {
    router.push(`/nfts/${address}`);
  };

  useEffect(() => {
    if (isOwner || !publicKey) {
      goBack();
    }
  }, [isOwner, router, goBack, publicKey]);

  if (!publicKey || (isOwner && router)) {
    return null;
  }

  if (called && !data?.nft && !loading) {
    return <Custom404 />;
  }

  return (
    <>
      <BlurPage>
        <NftByAddress address={address} />
      </BlurPage>
      <Modal title={`Make an offer`} open={true} setOpen={goBack}>
        {/* nft */}
        {nft && <NFTPreview loading={loading} nft={nft as any} />}
        {/* form */}
        <div className={`mt-8 flex w-full`}>
          <OfferForm
            nft={nft as Nft | any}
            marketplace={marketplace as Marketplace}
            refetch={refetch}
          />
        </div>
      </Modal>
    </>
  );
};

export default NewNFTOffer;

import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { LoadingContainer } from '@/components/elements/LoadingPlaceholders';
import Modal from '@/components/elements/Modal';
import OfferForm from '@/components/forms/OfferForm';
import BlurPage from '@/components/layouts/BlurPage';
import { imgOpt } from '@/common/utils';
import { useNftMarketplaceQuery, useNftPageQuery } from '../../../../src/graphql/indexerTypes';
import { Nft, Marketplace } from '@/types/types';

import Custom404 from '../../../404';
import NftByAddress, { Avatar, OverlappingCircles } from '../../[address]';
import { HOLAPLEX_MARKETPLACE_SUBDOMAIN } from '@/common/constants/marketplace';
import NFTPreview from '../../../../src/common/components/elements/NFTPreview';
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
  const isOwner = Boolean(nft?.owner?.address === publicKey?.toBase58());

  const router = useRouter();

  const goBack = () => {
    router.push(`/nfts/${address}`);
  };

  useEffect(() => {
    if (!publicKey || (isOwner && router)) {
      goBack();
    }
  }, [publicKey, isOwner, router, goBack]);

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

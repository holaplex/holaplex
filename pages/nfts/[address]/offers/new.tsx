import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
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

  const nft = data?.nft;
  const marketplace = data?.marketplace;

  const router = useRouter();

  const goBack = () => {
    router.back();
  };

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
        <div className={`mt-8 flex w-full justify-start`}>
          <div className={`relative aspect-square h-14 w-14`}>
            {loading ||
              (!imgLoaded && (
                <LoadingContainer className="absolute inset-0 rounded-lg bg-gray-800 shadow " />
              ))}
            {nft?.image && (
              <img
                onLoad={() => setImgLoaded(true)}
                src={imgOpt(nft?.image, 400)}
                alt={`nft-mini-image`}
                className={`block aspect-square w-full rounded-lg border-none object-cover `}
              />
            )}
          </div>
          <div className={`ml-5`}>
            <p className={`mb-0 text-base font-medium`}>{nft?.name}</p>
            <ul className={`mt-2`}>
              {loading ? (
                <></>
              ) : nft?.creators.length === 1 ? (
                <Link href={`/profiles/${nft?.creators[0].address}`}>
                  <a>
                    <Avatar address={nft?.creators[0].address} />
                  </a>
                </Link>
              ) : (
                <div>
                  <OverlappingCircles creators={nft?.creators || []} />
                </div>
              )}
            </ul>
          </div>
        </div>
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

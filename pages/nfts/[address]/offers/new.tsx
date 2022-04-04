import { GetServerSideProps } from 'next';
import BlurPage from '../../../../src/common/components/layouts/BlurPage';
import NftByAddress from '../../[address]';

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      address: context?.params?.address ?? '',
    },
  };
};

const NewNFTOffer = ({ address }: { address: string }) => {
  return (
    <BlurPage>
      <NftByAddress address={address} />
    </BlurPage>
  );
};

export default NewNFTOffer;

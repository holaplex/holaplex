import styled from 'styled-components';
import NavContainer from '@/modules/nfts/components/wizard/NavContainer';
import { StepWizardChildProps } from 'react-step-wizard';
import { Divider, PageHeader, Row } from 'antd';
import { MintStatus, NFTValue } from 'pages/nfts/new';
import { NFTPreviewGrid } from '@/common/components/elements/NFTPreviewGrid';
import { Storefront } from '@/modules/storefront/types';
import Paragraph from 'antd/lib/typography/Paragraph';
import Button from '@/common/components/elements/Button';
import router, { useRouter } from 'next/router';

interface Props extends Partial<StepWizardChildProps> {
  images: Array<File>;
  clearForm: () => void;
  nftValues: NFTValue[];
  storefront?: Storefront;
}

const StyledDivider = styled(Divider)`
  background-color: rgba(255, 255, 255, 0.1);
  height: 500px;
  margin: 0 46px;
`;

const Header = styled(PageHeader)`
  font-style: normal;
  font-weight: 900;
  font-size: 32px;
  line-height: 43px;
  color: #fff;
  padding-top: 10px;
  padding-left: 0;
`;

const Wrapper = styled.div`
  width: 413px;

  .ant-form-item-label {
    font-weight: 900;
  }

  .ant-form-item-control-input-content {
    input,
    textarea {
      border-radius: 4px;
    }
    input {
      height: 50px;
    }
  }
`;

export default function OffRampScreen({
  goToStep,
  clearForm,
  images,
  nftValues,
  storefront,
}: Props) {
  const router = useRouter();

  const listingUrl = storefront ? `https://${storefront.subdomain}.holaplex.com/owned` : '';

  const successfulMints = nftValues.filter((nft) => nft.mintStatus === MintStatus.SUCCESS).length;

  const titleTxt = successfulMints
    ? `🎉 You’ve minted ${successfulMints} NFT${successfulMints > 1 ? 's' : ''}!`
    : `You've minted ${0} NFTs`;
  const storefrontMintCopy = `${
    successfulMints > 1 ? 'They are' : 'It is'
  } available in your wallet. Now you can
  list ${successfulMints > 1 ? 'them' : 'it'} on your Holaplex store.`;

  const noStorefrontCopy =
    'On your Holaplex store you’ll be able to list and sell your NFTs. Setting up a store only takes 5 min and is totally free!';
  const mintCopy = successfulMints ? (storefront ? storefrontMintCopy : noStorefrontCopy) : '';

  const headerCopy = storefront
    ? `${
        successfulMints
          ? `Congratulations! You've minted ${successfulMints} NFT${
              successfulMints > 1 ? 's.' : '.'
            }`
          : 'No NFTs minted.'
      }`
    : 'Let’s set up your free Holaplex store';

  return (
    <NavContainer
      title={titleTxt}
      goToStep={goToStep}
      clearForm={clearForm}
      altClearText="Mint more NFTs"
    >
      <Row>
        <Wrapper>
          <Header>{headerCopy}</Header>
          <>
            <Paragraph
              style={{
                color: '#fff',
                opacity: 0.6,
                fontSize: 14,
                fontWeight: 400,
              }}
            >
              {mintCopy}
            </Paragraph>

            {successfulMints ? (
              <>
                {storefront ? (
                  <Button
                    type="primary"
                    onClick={() => router.push(listingUrl)}
                    style={{ height: 'fit-content', marginTop: 38 }}
                  >
                    List on your Holaplex store
                    <Paragraph style={{ fontSize: 14, opacity: 0.6 }}>
                      {storefront.subdomain}.holaplex.com
                    </Paragraph>
                  </Button>
                ) : (
                  <Button type="primary" onClick={() => router.push('/storefront/new')}>
                    Create your Free Store
                  </Button>
                )}
              </>
            ) : (
              <Button
                type="primary"
                onClick={() => goToStep!(1)}
                style={{ height: 'fit-content', marginTop: 38 }}
              >
                Start Over
              </Button>
            )}
          </>
        </Wrapper>
        <StyledDivider type="vertical" />
        <NFTPreviewGrid
          index={images.length} // trigger all NFT statuses for grid
          images={images}
          nftValues={nftValues}
        />
      </Row>
    </NavContainer>
  );
}

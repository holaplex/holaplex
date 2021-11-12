import styled from 'styled-components';
import NavContainer from '@/modules/nfts/components/wizard/NavContainer';
import { StepWizardChildProps } from 'react-step-wizard';
import { Divider, PageHeader, Row } from 'antd';
import { MintStatus, NFTValue } from 'pages/nfts/new';
import { NFTPreviewGrid } from '@/common/components/elements/NFTPreviewGrid';
import Paragraph from 'antd/lib/typography/Paragraph';
import Button from '@/common/components/elements/Button';

interface Props extends Partial<StepWizardChildProps> {
  images: Array<File>;
  clearForm: () => void;
  nftValues: NFTValue[];
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

export default function OffRampScreen({ goToStep, clearForm, images, nftValues }: Props) {
  const successfulMints = nftValues.filter((nft) => nft.mintStatus === MintStatus.SUCCESS).length;

  return (
    <NavContainer
      title={`🎉 You’ve minted ${successfulMints} NFT${successfulMints > 1 ? 's' : ''}!`}
      goToStep={goToStep}
      clearForm={clearForm}
      altClearText="Mint more NFTs"
    >
      <Row>
        <Wrapper>
          <Header>
            {successfulMints > 0
              ? `Congratulations! You've minted ${successfulMints} NFT${
                  successfulMints > 1 ? 's.' : '.'
                }`
              : 'No NFTs minted.'}
          </Header>
          {successfulMints > 0 && (
            <>
              <Paragraph
                style={{
                  color: '#fff',
                  opacity: 0.6,
                  fontSize: 14,
                  fontWeight: 400,
                }}
              >
                {successfulMints > 1 ? 'They are' : 'It is'} available in your wallet. Now you can
                list {successfulMints > 1 ? 'them' : 'it'} on your Holaplex store.
              </Paragraph>
              <Button type="primary" onClick={() => console.log('go to holoplex store')}>
                List on your Holaplex store
              </Button>
            </>
          )}
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

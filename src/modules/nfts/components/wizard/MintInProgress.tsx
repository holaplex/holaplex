import { Divider, Form, Row, Col, Space, Button } from 'antd';
import React, { useCallback, useContext, useEffect } from 'react';
import Image from 'next/image';
import { StepWizardChildProps } from 'react-step-wizard';
import styled from 'styled-components';
import GreenCheckIcon from '@/common/assets/images/green-check.svg';
import RedXClose from '@/common/assets/images/red-x-close.svg';
import Paragraph from 'antd/lib/typography/Paragraph';
import EmptySpinnerIcon from '@/common/assets/images/empty-spinner.svg';
import NavContainer from '@/modules/nfts/components/wizard/NavContainer';
import { Spinner } from '@/common/components/elements/Spinner';
import { Connection } from '@solana/web3.js';
import { actions } from '@metaplex/js';
import { MetadataFile, MintStatus, NFTValue } from 'pages/nfts/new';
import { Solana } from '@/modules/solana/types';
import { NFTPreviewGrid } from '@/common/components/elements/NFTPreviewGrid';
import { WalletContext } from '@/modules/wallet';

const { mintNFT } = actions;

const APPROVAL_FAILED_CODE = 4001;

enum TransactionStep {
  SENDING_FAILED,
  APPROVAL_FAILED,
  APPROVING,
  SENDING,
  FINALIZING,
  SUCCESS,
}

interface Props extends Partial<StepWizardChildProps> {
  images: Array<File>;
  wallet: Solana;
  connection: Connection;
  metaDataFile: MetadataFile;
  nftValues: NFTValue[];
  index: number;
  updateNFTValue: (value: NFTValue, index: number) => void;
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 16px;
  row-gap: 16px;
  grid-template-rows: 100px 100px 100px 100px 100px;
`;

const StyledDivider = styled(Divider)`
  background-color: rgba(255, 255, 255, 0.1);
`;

const MintStep = ({
  text,
  isActive,
  isDone,
  failed,
}: {
  text: string;
  isActive: boolean;
  isDone: boolean;
  failed?: boolean;
}) => {
  let icon;

  if (isDone) {
    icon = <Image width={32} height={32} src={GreenCheckIcon} alt="green-check" />;
  } else if (isActive) {
    icon = <Spinner />;
  } else if (failed) {
    icon = <Image width={32} height={32} src={RedXClose} alt="red-x-close" />;
  } else {
    icon = <Image width={32} height={32} src={EmptySpinnerIcon} alt="green-check" />;
  }

  return (
    <Row style={{ marginBottom: 16 }}>
      <Space size={17}>
        {icon}
        <Paragraph
          style={{
            fontSize: 14,
            fontWeight: isActive ? 900 : 400,
            opacity: isActive ? 1 : 0.6,
            marginBottom: 6,
          }}
        >
          {text}
        </Paragraph>
      </Space>
    </Row>
  );
};

export default function MintInProgress({
  previousStep,
  goToStep,
  images,
  nextStep,
  isActive,
  metaDataFile,
  nftValues,
  wallet,
  updateNFTValue,
  connection,
  index,
}: Props) {
  const [transactionStep, setTransactionStep] = React.useState(TransactionStep.APPROVING);
  const showErrors =
    transactionStep === TransactionStep.SENDING_FAILED ||
    transactionStep === TransactionStep.APPROVAL_FAILED;

  const { connect } = useContext(WalletContext);
  const nftValue = nftValues[index];

  if (!wallet) {
    // connect({ redirect: '/nfts/new' });
  }

  const handleNext = useCallback(() => {
    const updatedValue = showErrors
      ? { ...nftValue, mintStatus: MintStatus.FAILED }
      : { ...nftValue, mintStatus: MintStatus.SUCCESS };
    updateNFTValue(updatedValue, index);

    setTransactionStep(TransactionStep.APPROVING);
    nextStep!();
  }, [nextStep, nftValue, updateNFTValue, showErrors, index, setTransactionStep]);

  const attemptMint = useCallback(async () => {
    setTransactionStep(TransactionStep.APPROVING);

    try {
      const mintResp = await mintNFT({
        connection,
        wallet,
        uri: metaDataFile.uri,
        maxSupply: nftValue.properties.maxSupply,
      });
      setTransactionStep(TransactionStep.FINALIZING);
      await connection.confirmTransaction(mintResp.txId);
      setTransactionStep(TransactionStep.SUCCESS);
      handleNext();
    } catch (err) {
      console.log('mintNFT err', err);
      if (err?.code === APPROVAL_FAILED_CODE) {
        setTransactionStep(TransactionStep.APPROVAL_FAILED);
      } else {
        setTransactionStep(TransactionStep.SENDING_FAILED);
      }
    }
  }, [metaDataFile, nftValue, handleNext, connection, wallet]);

  useEffect(() => {
    if (showErrors) {
      return;
    }

    if (isActive && metaDataFile && nftValue) {
      attemptMint();
    }
  }, [isActive, showErrors, metaDataFile, nftValue, attemptMint, index]);

  if (!nftValue) {
    return null;
  }

  return (
    <NavContainer
      title={`Minting ${index + 1} of ${images.length}`}
      previousStep={previousStep}
      goToStep={goToStep}
    >
      <Row>
        <Col style={{ marginRight: 224 }}>
          <Row>
            <Paragraph style={{ fontWeight: 900 }}>Progress</Paragraph>
          </Row>
          <Row style={{ marginTop: 37 }}>
            <Col style={{ minWidth: 237 }}>
              <MintStep
                text="Approving transaction"
                isActive={transactionStep === TransactionStep.APPROVING}
                isDone={transactionStep > TransactionStep.APPROVING}
                failed={transactionStep === TransactionStep.APPROVAL_FAILED}
              />
              <MintStep
                text="Sending transaction to Solana"
                isActive={transactionStep === TransactionStep.SENDING}
                isDone={transactionStep > TransactionStep.SENDING}
                failed={transactionStep === TransactionStep.SENDING_FAILED}
              />
              <MintStep
                text="Waiting for final confirmation"
                isActive={transactionStep === TransactionStep.FINALIZING}
                isDone={transactionStep === TransactionStep.SUCCESS}
              />
            </Col>
          </Row>
          {showErrors && (
            <>
              <Row style={{ marginTop: 144 }}>
                <Paragraph style={{ fontSize: 14, color: '#D24040' }}>
                  {/* TODO: Show error */}
                  Mint #{index + 1} failed.
                </Paragraph>
              </Row>
              <Row>
                <Space size={8}>
                  <Button
                    type="default"
                    onClick={handleNext}
                    style={{ background: 'rgba(53, 53, 53, 1)' }}
                  >
                    Skip
                  </Button>

                  <Button
                    type="primary"
                    onClick={() => setTransactionStep(TransactionStep.APPROVING)}
                  >
                    Try Again
                  </Button>
                </Space>
              </Row>
            </>
          )}
        </Col>

        <StyledDivider type="vertical" style={{ margin: '0 46px', height: 500 }} />
        <NFTPreviewGrid index={index} images={images} nftValues={nftValues} />
      </Row>
    </NavContainer>
  );
}

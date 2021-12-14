import { Divider, Row, Col, Space, Button } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { StepWizardChildProps } from 'react-step-wizard';
import GreenCheckIcon from '@/common/assets/images/green-check.svg';
import RedXClose from '@/common/assets/images/red-x-close.svg';
import Paragraph from 'antd/lib/typography/Paragraph';
import EmptySpinnerIcon from '@/common/assets/images/empty-spinner.svg';
import NavContainer from '@/modules/nfts/components/wizard/NavContainer';
import { Spinner } from '@/common/components/elements/Spinner';
import { Connection, PublicKey } from '@solana/web3.js';
import { actions } from '@holaplex/js';
import { MintStatus, NFTValue, UploadedFilePin } from 'pages/nfts/new';
import { Solana } from '@/modules/solana/types';
import { NFTPreviewGrid } from '@/common/components/elements/NFTPreviewGrid';
import { holaSignMetadata } from '@/modules/storefront/approve-nft';
import styled from 'styled-components';
import BN from 'bn.js';

const { mintNFT } = actions;

interface MintNFTResponse {
  txId: string;
  mint: PublicKey;
  metadata: PublicKey;
  edition: PublicKey;
}

const StyledDivider = styled(Divider)`
  margin: 0 46px;
  height: 500px;
  background-color: rgba(255, 255, 255, 0.1);
`;

const APPROVAL_FAILED_CODE = 4001;
const META_PROGRAM_ID = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s';

enum TransactionStep {
  SENDING_FAILED,
  APPROVAL_FAILED,
  META_DATA_UPLOAD_FAILED,
  META_DATA_UPLOADING,
  APPROVING,
  SENDING,
  FINALIZING,
  SIGNING_FAILED,
  SIGNING,
  SUCCESS,
}

interface Props extends Partial<StepWizardChildProps> {
  images: Array<File>;
  wallet: Solana;
  connection: Connection;
  nftValues: NFTValue[];
  index: number;
  updateNFTValue: (value: NFTValue, index: number) => void;
  uploadMetaData: (value: NFTValue) => Promise<UploadedFilePin>;
}

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

  // TODO: This might be better off as a switch and isActive, isDone, failed combined into a `status` prop
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
  nftValues,
  wallet,
  updateNFTValue,
  uploadMetaData,
  connection,
  index,
}: Props) {
  const [transactionStep, setTransactionStep] = useState(TransactionStep.META_DATA_UPLOADING);
  const [mintResp, setMintResp] = useState<MintNFTResponse | null>(null);
  const showErrors =
    transactionStep === TransactionStep.SENDING_FAILED ||
    transactionStep === TransactionStep.APPROVAL_FAILED ||
    transactionStep === TransactionStep.SIGNING_FAILED;

  const nftValue = nftValues[index];

  const showNavigation = showErrors;

  const handleNext = useCallback(() => {
    const updatedValue = showErrors
      ? { ...nftValue, mintStatus: MintStatus.FAILED }
      : { ...nftValue, mintStatus: MintStatus.SUCCESS };
    updateNFTValue(updatedValue, index);

    setTransactionStep(TransactionStep.APPROVING);
    nextStep!();
  }, [nextStep, nftValue, updateNFTValue, showErrors, index, setTransactionStep]);

  const attemptHolaplexSign = useCallback(async () => {
    if (!mintResp) {
      throw new Error('No Mint Response, something went wrong');
    }

    try {
      if (!process.env.NEXT_PUBLIC_SOLANA_ENDPOINT) {
        throw new Error('No Solana Endpoint');
      }

      const metaProgramId = new PublicKey(META_PROGRAM_ID);
      const { metadata } = mintResp;

      await holaSignMetadata({
        solanaEndpoint: process.env.NEXT_PUBLIC_SOLANA_ENDPOINT,
        metadata,
        metaProgramId,
        onComplete: () => {
          setTransactionStep(TransactionStep.SUCCESS);
          handleNext();
        },
        onError: (msg) => {
          throw new Error(msg);
        },
      });
    } catch (err) {
      console.log('signing err', err);
      setTransactionStep(TransactionStep.SIGNING_FAILED);
    }
  }, [setTransactionStep, mintResp, handleNext]);

  const attemptMint = useCallback(
    async (metaData: UploadedFilePin) => {
      if (!metaData) {
        throw new Error('No Meta Data, something went wrong');
      }

      setTransactionStep(TransactionStep.APPROVING);

      try {
        const maxSupply = new BN(nftValue.properties.maxSupply);
        const mintResp = await mintNFT({
          connection,
          wallet,
          uri: metaData.uri,
          maxSupply,
        });
        setMintResp(mintResp);
        setTransactionStep(TransactionStep.FINALIZING);
        await connection.confirmTransaction(mintResp.txId);
        setTransactionStep(TransactionStep.SUCCESS);
      } catch (err) {
        if (err?.code === APPROVAL_FAILED_CODE) {
          setTransactionStep(TransactionStep.APPROVAL_FAILED);
        } else {
          setTransactionStep(TransactionStep.SENDING_FAILED);
        }

        return;
      }

      setTransactionStep(TransactionStep.SIGNING);
    },
    [nftValue, connection, wallet]
  );

  const attemptMetaDataUpload = useCallback(async () => {
    if (!nftValue) {
      throw new Error('No NFT Value, something went wrong');
    }

    if (nftValue.mintStatus === MintStatus.SUCCESS) {
      return; // Don't accidentally mint
    }

    let metaData: UploadedFilePin | null = null;

    try {
      metaData = await uploadMetaData(nftValue);

      attemptMint(metaData);
    } catch (err) {
      setTransactionStep(TransactionStep.META_DATA_UPLOAD_FAILED);
    }
  }, [attemptMint, nftValue, uploadMetaData, setTransactionStep]);

  useEffect(() => {
    if (showErrors) {
      return;
    }

    if (isActive && nftValue) {
      if (transactionStep === TransactionStep.META_DATA_UPLOADING) {
        attemptMetaDataUpload();
      } else if (transactionStep === TransactionStep.SIGNING) {
        attemptHolaplexSign();
      }
    }
  }, [
    isActive,
    showErrors,
    nftValue,
    transactionStep,
    attemptHolaplexSign,
    attemptMetaDataUpload,
    index,
  ]);

  if (!nftValue) {
    return null;
  }

  return (
    <NavContainer
      title={`Minting ${index + 1} of ${images.length}`}
      previousStep={previousStep}
      goToStep={goToStep}
      showNavigation={showNavigation}
    >
      <Row>
        <Col style={{ marginRight: 224 }}>
          <Row>
            <Paragraph style={{ fontWeight: 900 }}>Progress</Paragraph>
          </Row>
          <Row style={{ marginTop: 37 }}>
            <Col style={{ minWidth: 237 }}>
              <MintStep
                text="Uploading metadata"
                isActive={transactionStep === TransactionStep.META_DATA_UPLOADING}
                isDone={transactionStep > TransactionStep.META_DATA_UPLOADING}
                failed={transactionStep === TransactionStep.META_DATA_UPLOAD_FAILED}
              />
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
                isDone={transactionStep > TransactionStep.FINALIZING}
              />
              <MintStep
                text="Signing Holaplex as co-creator"
                isActive={transactionStep === TransactionStep.SIGNING}
                isDone={transactionStep === TransactionStep.SUCCESS}
                failed={transactionStep === TransactionStep.SIGNING_FAILED}
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
                  {transactionStep !== TransactionStep.SIGNING_FAILED && (
                    <Button
                      type="default"
                      onClick={handleNext}
                      style={{ background: 'rgba(53, 53, 53, 1)' }}
                    >
                      Skip
                    </Button>
                  )}

                  <Button
                    type="primary"
                    onClick={() =>
                      setTransactionStep(
                        transactionStep === TransactionStep.SIGNING_FAILED
                          ? TransactionStep.SIGNING
                          : TransactionStep.APPROVING
                      )
                    }
                  >
                    Try Again
                  </Button>
                </Space>
              </Row>
            </>
          )}
        </Col>

        <StyledDivider type="vertical" />
        <NFTPreviewGrid index={index} images={images} nftValues={nftValues} />
      </Row>
    </NavContainer>
  );
}

import { Divider, Form, Row, Col, Space } from 'antd';
import React, { useEffect } from 'react';
import Image from 'next/image';
import { StepWizardChildProps } from 'react-step-wizard';
import styled from 'styled-components';
import GreenCheckIcon from '@/common/assets/images/green-check.svg';
import EmptySpinnerIcon from '@/common/assets/images/empty-spinner.svg';
import SpinnerIcon from '@/common/assets/images/spinner.svg';
import Paragraph from 'antd/lib/typography/Paragraph';
import NavContainer from '@/modules/nfts/components/wizard/NavContainer';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { Spinner } from '@/common/components/elements/Spinner';
import { Connection, PublicKey } from '@solana/web3.js';
import { NodeWallet, Wallet, actions } from '@metaplex/js';
import { MetadataFile } from 'pages/nfts/new';
import { getPhantomWallet } from '@solana/wallet-adapter-wallets';
import { useWallet } from '@solana/wallet-adapter-react';
import { Solana } from '@/modules/solana/types';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

interface Props extends Partial<StepWizardChildProps> {
  images: Array<File>;
  wallet: Solana;
  connection: Connection;
  metaDataFile: MetadataFile;
  maxSupply: number;
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

const ButtonFormItem = styled(Form.Item)`
  .ant-form-item-control-input-content {
    display: flex;
    flex-direction: row-reverse;
  }
`;

const MintStep = ({
  text,
  icon,
  isActive,
}: {
  text: string;
  icon: JSX.Element;
  isActive: boolean;
}) => {
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
  wallet,
  connection,
  maxSupply,
}: Props) {
  // const handleNext = () => {
  //   nextStep!();
  // };
  const { mintNFT } = actions;

  useEffect(() => {
    if (isActive && metaDataFile) {
      console.log('metaDataFile', metaDataFile);
      mintNFT({
        connection,
        wallet,
        uri: metaDataFile.uri,
        maxSupply,
      })
        .then((mintResp) => {
          console.log('mintResp', mintResp);
        })
        .catch((err) => {
          console.log('mintNFT err', err);
        });
    }
  }, [isActive, mintNFT, metaDataFile, wallet, connection]);

  const steps = [
    {
      text: 'Approving Transaction',
      icon: <Image width={32} height={32} src={GreenCheckIcon} alt="green-check" />,
      isActive: false,
    },
    {
      text: 'Sending transsaction to Solana',
      icon: <Image width={32} height={32} src={GreenCheckIcon} alt="green-check" />,
      isActive: false,
    },
    {
      text: 'Waiting for final confirmation',
      icon: <Image width={32} height={32} src={GreenCheckIcon} alt="green-check" />,
      isActive: false,
    },
    {
      text: 'Waiting for final confirmation',
      icon: <Spinner />,
      // icon: <Spin indicator={<Image width={32} height={32} src={SpinnerIcon} alt="spinner" />} />,
      isActive: true,
    },
  ];

  return (
    <NavContainer
      title={`Minting ${images.length}`}
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
              {steps.map(({ text, icon, isActive }) => (
                <MintStep key={text} text={text} icon={icon} isActive={isActive} />
              ))}
            </Col>
          </Row>
        </Col>

        <StyledDivider type="vertical" style={{ margin: '0 46px', height: 500 }} />
        <Grid>
          {images.map((image) => (
            <Image
              width={100}
              height={100}
              src={URL.createObjectURL(image)}
              alt={image.name}
              unoptimized={true}
              key={image.name}
            />
          ))}
        </Grid>
      </Row>
    </NavContainer>
  );
}

import { Divider, Form, Row, Col } from 'antd';
import React, { useEffect } from 'react';
import Image from 'next/image';
import { StepWizardChildProps } from 'react-step-wizard';
import styled from 'styled-components';
import Button from '@/common/components/elements/Button';
import Paragraph from 'antd/lib/typography/Paragraph';
import { Coingecko, Currency } from '@metaplex/js';
import NavContainer from '@/modules/nfts/components/wizard/NavContainer';

const SOL_COST_PER_NFT = 0.00714;

interface Props extends Partial<StepWizardChildProps> {
  images: Array<File>;
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

async function getSolRate() {
  const rates = await new Coingecko().getRate([Currency.SOL], Currency.USD);
  return rates[0].rate;
}

export default function PriceSummary({ previousStep, goToStep, images, nextStep }: Props) {
  const [totalSolCost, setTotalSolCost] = React.useState(images.length * SOL_COST_PER_NFT);
  const [totalInUSD, setTotalInUSD] = React.useState(0.0);
  const handleNext = () => {
    nextStep!();
  };

  useEffect(() => {
    const total = images.length * SOL_COST_PER_NFT;
    setTotalSolCost(total);

    getSolRate().then((rate) => {
      setTotalInUSD(rate * total);
    });
  }, [images, setTotalSolCost, setTotalInUSD]);

  return (
    <NavContainer title="Fees" previousStep={previousStep} goToStep={goToStep}>
      <Row>
        <Col style={{ marginRight: 224 }}>
          <Row>
            <Paragraph style={{ fontWeight: 900 }}>Cost to mint {images.length} NFTs</Paragraph>
          </Row>

          <Row>
            <Col style={{ minWidth: 237 }}>
              <Row justify="space-between">
                <Paragraph style={{ fontSize: 14, opacity: 0.6 }}>
                  Network fee x{images.length}
                </Paragraph>
                <Paragraph style={{ fontSize: 14 }}>◎ 0.00714</Paragraph>
              </Row>
            </Col>
          </Row>

          <StyledDivider />

          <Row justify="space-between">
            <Paragraph style={{ opacity: 0.6, fontSize: 14 }}>Total:</Paragraph>
            <Col>
              <Row>
                <Paragraph style={{ fontSize: 18, marginBottom: 0 }}>◎ {totalSolCost}</Paragraph>
              </Row>
              <Row justify="end">
                <Paragraph style={{ fontSize: 14, opacity: 0.6 }}>
                  ${totalInUSD.toFixed(2)}
                </Paragraph>
              </Row>
            </Col>
          </Row>

          <Row>
            <ButtonFormItem style={{ marginTop: 42 }}>
              <Button type="primary" onClick={handleNext}>
                Mint {images.length} NFTs
              </Button>
            </ButtonFormItem>
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

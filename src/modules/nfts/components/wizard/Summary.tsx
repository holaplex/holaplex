import NavContainer from '@/modules/nfts/components/wizard/NavContainer';
import { Divider, FormInstance, PageHeader, Row, Space, Typography } from 'antd';
import React, { useEffect } from 'react';
import Image from 'next/image';
import { StepWizardChildProps } from 'react-step-wizard';
import styled from 'styled-components';
import Button from '@/common/components/elements/Button';
import { NFTAttribute, MintDispatch, NFTFormValue } from 'pages/nfts/new';

interface Props extends Partial<StepWizardChildProps> {
  images: Array<File>;
  dispatch: MintDispatch;
  form: FormInstance;
  formValues: NFTFormValue[] | null;
  uploadMetaData: (files: any) => Promise<void>;
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 34px;
  row-gap: 74px;
`;

const Header = styled(PageHeader)`
  font-style: normal;
  font-weight: 900;
  font-size: 48px;
  line-height: 65px;
  text-align: center;
  width: 701px;
  margin-top: 47px;
  color: #fff;
`;

const { Paragraph, Title } = Typography;

const StyledSummaryItem = styled.div`
  max-width: 245px;
  .ant-typography {
    color: #fff;
  }
`;

const Attribute = styled(Space)`
  :not(:last-child) {
    margin-bottom: 9px;
  }

  .ant-space-item:first-of-type {
    .ant-typography {
      opacity: 60%;
    }
  }
`;
const SummaryItem = ({
  value,
  image,
  showRoyaltyPercentage,
}: {
  value: NFTFormValue;
  image: File;
  showRoyaltyPercentage: boolean;
}) => {
  if (!image) {
    throw new Error('Image is required');
  }

  return (
    <StyledSummaryItem>
      <Image
        width={245}
        height={245}
        src={URL.createObjectURL(image)}
        objectFit="cover"
        alt={image.name}
        unoptimized={true}
        key={image.name}
      />
      <Title level={4} style={{ marginBottom: 3 }}>
        {value.name}
      </Title>
      {value.collection && <Paragraph style={{ marginBottom: 18 }}>{value.collection}</Paragraph>}
      <Paragraph
        ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}
        style={{ opacity: '60%', color: '#fff' }}
      >
        {value.description}
      </Paragraph>
      {showRoyaltyPercentage && (
        <Attribute>
          <Paragraph style={{ width: 110 }}>Royalty:</Paragraph>
          <Paragraph>{value.seller_fee_basis_points}</Paragraph>
        </Attribute>
      )}
      {value.attributes?.map((attribute: NFTAttribute, index: number) =>
        attribute.trait_type ? (
          <Attribute key={index}>
            <Paragraph style={{ width: 110 }}>{attribute.trait_type}:</Paragraph>
            <Paragraph>{attribute.value}</Paragraph>
          </Attribute>
        ) : null
      )}
    </StyledSummaryItem>
  );
};
export default function Summary({
  previousStep,
  goToStep,
  images,
  nextStep,
  dispatch,
  formValues,
  goToNamedStep,
  uploadMetaData,
}: Props) {
  // TODO: Can extract this to top level component
  const upload = async () => {
    console.log('uploading images', images);
    const body = new FormData();

    images.forEach((i) => body.append(i.name, i, i.name));

    const resp = await fetch('/api/ipfs/upload', {
      method: 'POST',
      body,
    });

    const uploadedFilePins = await resp.json();
    dispatch({ type: 'UPLOAD_FILES', payload: uploadedFilePins.files });
    await uploadMetaData(uploadedFilePins.files);
    nextStep!();
  };

  if (!formValues) return null;

  return (
    <NavContainer title="Summary" previousStep={previousStep} goToStep={goToStep}>
      <Header>Do these look right?</Header>
      <Button onClick={upload} type="primary">
        Looks good
      </Button>

      <Row style={{ marginTop: 78 }}>
        <Grid>
          {formValues.map(
            (fv: NFTFormValue, index: number) =>
              images[index] && (
                <SummaryItem
                  key={fv.name}
                  value={fv}
                  image={images[index]}
                  showRoyaltyPercentage={formValues.some((nft1) =>
                    formValues.some(
                      (nft2) => nft1.seller_fee_basis_points !== nft2.seller_fee_basis_points
                    )
                  )}
                />
              )
          )}
        </Grid>
      </Row>
    </NavContainer>
  );
}

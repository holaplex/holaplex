import NavContainer from '@/modules/nfts/components/wizard/NavContainer';
import { FormInstance, PageHeader, Row, Space, Typography, notification } from 'antd';
import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { StepWizardChildProps } from 'react-step-wizard';
import styled from 'styled-components';
import Button from '@/common/components/elements/Button';
import { NFTAttribute, MintDispatch, NFTFormValue, UploadedFilePin } from 'pages/nfts/new';
import { Spinner } from '@/common/components/elements/Spinner';

interface Props extends Partial<StepWizardChildProps> {
  images: Array<File>;
  dispatch: MintDispatch;
  form: FormInstance;
  formValues: NFTFormValue[] | null;
  setNFTValues: (filePins: UploadedFilePin[]) => void;
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
  showCreatorCount,
}: {
  value: NFTFormValue;
  image: File;
  showRoyaltyPercentage: boolean;
  showCreatorCount: boolean;
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
      {value.collectionName && (
        <Paragraph style={{ marginBottom: 5, fontWeight: 'bold' }}>
          {value.collectionName}
        </Paragraph>
      )}
      {value.collectionFamily && (
        <Paragraph style={{ marginBottom: 18 }}>{value.collectionFamily}</Paragraph>
      )}
      <Paragraph
        ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}
        style={{ opacity: '60%', color: '#fff' }}
      >
        {value.description}
      </Paragraph>
      {showRoyaltyPercentage && (
        <Attribute>
          <Paragraph style={{ width: 110 }}>Royalty:</Paragraph>
          <Paragraph>{value.seller_fee_basis_points / 100}%</Paragraph>
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
      {showCreatorCount && (
        <Attribute>
          <Paragraph style={{ width: 110 }}>Creators:</Paragraph>
          <Paragraph>{value.properties.creators.length}</Paragraph>
        </Attribute>
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
  setNFTValues,
}: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFailed, setUploadFailed] = useState(false);

  const upload = async () => {
    const body = new FormData();

    images.forEach((i) => body.append(i.name, i, i.name));

    setIsUploading(true);
    setUploadFailed(false);
    try {
      const resp = await fetch('/api/ipfs/upload', {
        method: 'POST',
        body,
      });

      const uploadedFilePins = await resp.json();
      dispatch({ type: 'UPLOAD_FILES', payload: uploadedFilePins.files });
      setNFTValues(uploadedFilePins.files);
      nextStep!();
    } catch {
      notification.error({ message: 'Upload of assets to IPFS failed, please try again' });
      setUploadFailed(true);
      setIsUploading(false);
    }
  };

  // if one or more NFTs have a different royalty percentage it makes sense to show it in the summary
  const showRoyaltyPercentage = useMemo(() => {
    return (
      formValues?.some((nft1) =>
        formValues.some((nft2) => nft1.seller_fee_basis_points !== nft2.seller_fee_basis_points)
      ) ?? false
    );
  }, [formValues]);

  // if one or more NFTs have a different number of creators(other than seller and holaplex) it makes sense to show it in the summary.
  const showCreatorCount = useMemo(
    () =>
      formValues?.some((nft1) =>
        formValues.some(
          (nft2) => nft1.properties.creators.length !== nft2.properties.creators.length
        )
      ) ?? false,
    [formValues]
  );

  if (!formValues) return null;

  return (
    <NavContainer title="Summary" previousStep={previousStep} goToStep={goToStep}>
      <Header>Do these look right?</Header>
      <Button
        onClick={upload}
        type="primary"
        style={{ display: 'flex', alignItems: 'center' }}
        disabled={isUploading}
      >
        {uploadFailed ? 'Retry' : 'Looks good'}
        {isUploading && <Spinner style={{ marginLeft: 8, marginTop: 5 }} height={24} width={24} />}
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
                  showRoyaltyPercentage={showRoyaltyPercentage}
                  showCreatorCount={showCreatorCount}
                />
              )
          )}
        </Grid>
      </Row>
    </NavContainer>
  );
}

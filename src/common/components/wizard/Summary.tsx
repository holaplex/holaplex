import NavContainer from '@/common/components/wizard/NavContainer';
import { Divider, FormInstance, PageHeader, Row, Space, Typography } from 'antd';
import React, { useEffect } from 'react';
import Image from 'next/image';
import { StepWizardChildProps } from 'react-step-wizard';
import styled from 'styled-components';
import Button from '@/common/components/elements/Button';
import { NFTFormAttribute, MintDispatch, NFTFormValue } from 'pages/nfts/new';

interface Props extends Partial<StepWizardChildProps> {
  images: Array<File>;
  dispatch: MintDispatch;
  form: FormInstance;
  formValues: any; // TODO: Type this
  uploadMetaData: (files: any) => void;
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

const Attributes = styled.div``;

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
const SummaryItem = ({ value, image }: { value: NFTFormValue; image: File }) => {
  if (!image) {
    throw new Error('Image is required');
  }

  return (
    <StyledSummaryItem>
      <Image
        width={245}
        height={245}
        src={URL.createObjectURL(image)}
        alt={image.name}
        unoptimized={true}
        key={image.name}
      />
      <Title level={4} style={{ marginBottom: 3 }}>
        {value.name}
      </Title>
      <Paragraph style={{ marginBottom: 18 }}>Stylish Studs</Paragraph>
      <Paragraph
        ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}
        style={{ opacity: '60%', color: '#fff' }}
      >
        {value.description}
      </Paragraph>
      <Attributes>
        {/* Is there a way to not have undefined values show in the form object? */}
        {value.attributes.map((attribute: NFTFormAttribute, index: number) =>
          attribute.attrKey ? (
            <Attribute key={index}>
              <Paragraph style={{ width: 110 }}>{attribute.attrKey}:</Paragraph>
              <Paragraph>{attribute.attrVal}</Paragraph>
            </Attribute>
          ) : null,
        )}
      </Attributes>
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
  isActive,
  form,
  uploadMetaData,
}: Props) {
  // useEffect(() => {
  //   if (isActive) {
  //     form.submit();
  //   }
  // }, [form, isActive]);

  const handleNext = () => {
    nextStep!();
  };

  // TODO: Can extract this to top level component
  const upload = async () => {
    console.log('uploading images', images);
    const body = new FormData();

    images.forEach((i) => body.append(i.name, i, i.name));

    // const resp = await fetch('/api/ipfs/upload', {
    //   method: 'POST',
    //   body,
    // });

    // const uploadedFilePins = await resp.json()
    const uploadedFilePins = {
      files: [
        {
          uri: 'https://bafkreiaqyueyi6pj4dno6a5xdioh3qq4wcckk6zp3a4r3o4ugu63qsgpci.ipfs.dweb.link?ext=png',
          name: 'image 3.png',
          type: 'image/png',
        },
        {
          uri: 'https://bafkreihoddhywijzgytw7tocwilq7bnuvdbm3cu5t2wass3f7ce6whv3qm.ipfs.dweb.link?ext=png',
          name: 'image 8.png',
          type: 'image/png',
        },
      ],
    };

    console.log('up loaded files are being set');
    dispatch({ type: 'UPLOAD_FILES', payload: uploadedFilePins.files });
    uploadMetaData(uploadedFilePins.files); // TODO: we should probably be doing this all in the same location, i would move this function to the top level component
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
          {formValues.map((fv: NFTFormValue, index: number) => (
            <SummaryItem key={fv.name} value={fv} image={images[index]} /> // I don't like finding the image by assumption of its position by index, but attaching the image name to the form value is an incredible pain, how else can we confidently find our image?
          ))}
        </Grid>
      </Row>
    </NavContainer>
  );
}

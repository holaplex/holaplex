import NavContainer from '@/common/components/wizard/NavContainer';
import { Divider, FormInstance, PageHeader, Space, Typography } from 'antd';
import React from 'react';
import Image from 'next/image';
import { StepWizardChildProps } from 'react-step-wizard';
import styled from 'styled-components';
import Button from '@/common/components/elements/Button';
import { MintAction } from 'pages/nfts/new';

interface Props extends Partial<StepWizardChildProps> {
  images: Array<File>;
  dispatch: (payload: MintAction) => void;
  form: FormInstance;
  // index: number;
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 34px;
  row-gap: 74px;
`;

const InnerContainer = styled.div`
  display: flex;
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

const { Text, Paragraph, Title } = Typography;

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
const SummaryItem = ({ image }) => {
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
        Stylish Stud #124
      </Title>
      <Paragraph style={{ marginBottom: 18 }}>Stylish Studs</Paragraph>
      <Paragraph
        ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}
        style={{ opacity: '60%', color: '#fff' }}
      >
        Here they come down the stretch! The Stylish Studs are a collection of 10,000 unique NFT's
        some more text that we have to expand........
      </Paragraph>
      <Attributes>
        <Attribute>
          <Paragraph style={{ width: 110 }}>Background:</Paragraph>
          <Paragraph>Red</Paragraph>
        </Attribute>
        <Attribute>
          <Paragraph style={{ width: 110 }}>Head:</Paragraph>
          <Paragraph>Biker Helmet</Paragraph>
        </Attribute>
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
  form,
}: Props) {
  const handleNext = () => {
    nextStep!();
  };

  const upload = async () => {
    console.log('uploading images', images);
    const body = new FormData();

    images.forEach((i) => body.append(i.name, i, i.name));

    const resp = await fetch('/api/ipfs/upload', {
      method: 'POST',
      body,
    });

    const uploadedFilePins = await resp.json();
    // const uploadedFilePins = {
    //   files: [
    //     {
    //       uri: 'https://bafkreihoddhywijzgytw7tocwilq7bnuvdbm3cu5t2wass3f7ce6whv3qm.ipfs.dweb.link',
    //       name: 'image 8.png',
    //       type: 'image/png',
    //     },
    //   ],
    // };

    dispatch({ type: 'UPLOAD_FILES', payload: uploadedFilePins.files });
    form.submit();
  };

  return (
    <NavContainer title="Summary" previousStep={previousStep} goToStep={goToStep}>
      <Header>Do these look right?</Header>
      <Button onClick={upload} type="primary" style={{ margin: '24px 0 78px;' }}>
        Looks good
      </Button>

      <InnerContainer>
        <Grid>
          {images.map((image) => (
            <SummaryItem image={image} />
          ))}
        </Grid>
      </InnerContainer>
    </NavContainer>
  );
}

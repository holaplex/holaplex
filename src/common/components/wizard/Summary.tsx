import NavContainer from '@/common/components/wizard/NavContainer';
import { Divider, FormInstance, PageHeader, Space } from 'antd';
import React from 'react';
import Image from 'next/image';
import { StepWizardChildProps } from 'react-step-wizard';
import styled from 'styled-components';
import Button from '@/common/components/elements/Button';

interface Props extends Partial<StepWizardChildProps> {
  images: Array<File>;
  // index: number;
  // form: FormInstance;
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 216px;
  column-gap: 16px;
  row-gap: 16px;
  max-height: 500px;
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
  margin-top: 102px;
  color: #fff;
`;

export default function Summary({ previousStep, goToStep, images, nextStep }: Props) {
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

    console.log('json resp is', JSON.stringify(uploadedFilePins));
  };
  return (
    <NavContainer title="Summary" previousStep={previousStep} goToStep={goToStep}>
      <Header>Do these look right?</Header>
      <InnerContainer>
        <Button onClick={upload}>Looks good</Button>
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
      </InnerContainer>
    </NavContainer>
  );
}

import Button from '@/common/components/elements/Button';
import { Layout, PageHeader, Space } from 'antd';
import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import ArrowLeft from '@/common/assets/images/arrow-left.svg';
import XCloseIcon from '@/common/assets/images/x-close.svg';
import RedXClose from '@/common/assets/images/red-x-close.svg';
import { StepWizardChildProps } from 'react-step-wizard';

const StyledLayout = styled(Layout)`
  display: flex;
  align-items: center;
  padding: 61px 142px 97px;
`;

const Header = styled(PageHeader)`
  font-family: Nunito Sans;
  font-style: normal;
  font-weight: 900;
  font-size: 48px;
  line-height: 65px;
  text-align: center;
  width: 701px;

  color: #fff;
`;

const GoBack = styled.i`
  position: absolute;
  top: 32px;
  left: 40px;
  cursor: pointer;
`;

const XClose = styled.i`
  position: absolute;
  top: 32px;
  right: 40px;
  cursor: pointer;
`;

const Grid = styled(Space)`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  width: 701px;
  column-gap: 24px;
  margin: 59px 0 83px;
`;

const imageLinks = [
  '/images/test-image.png',
  '/images/test-image.png',
  '/images/test-image.png',
  '/images/test-image.png',
  '/images/test-image.png',
  '/images/test-image.png',
  '/images/test-image.png',
  '/images/test-image.png',
];

const AddNFTButton = styled.button`
  width: 120px;
  height: 120px;
  background: #1a1a1a;
  border-radius: 4px;
  border-color: #1a1a1a;
  cursor: pointer;

  img {
    transform: rotate(45deg);
  }
`;

const StyledRemoveNFT = styled.div`
  position: absolute;
  top: -9px;
  right: 4px;
  display: none;
  cursor: pointer;
`;

const ImageContainer = styled.div`
  position: relative;

  &:hover {
    ${StyledRemoveNFT} {
      display: block;
    }
  }
`;

interface Props extends Partial<StepWizardChildProps> {
  images: Array<File>;
}

export default function Verify({ previousStep, nextStep, goToStep, images }: Props) {
  return (
    <StyledLayout>
      <GoBack onClick={previousStep}>
        <Image width={24} height={24} src={ArrowLeft} alt="arrow-left" />
      </GoBack>
      <XClose onClick={() => goToStep!(1)}>
        <Image width={24} height={24} src={XCloseIcon} alt="x-close" />
      </XClose>

      <Header>Do these look right?</Header>
      <Grid>
        {images.map((i) => (
          <ImageContainer key={i.name}>
            <Image
              width={120}
              height={120}
              src={URL.createObjectURL(i)}
              alt="test-image"
              unoptimized={true}
            />

            <StyledRemoveNFT onClick={() => console.log('remove')}>
              <Image width={24} height={24} src={RedXClose} alt="remove-nft" />
            </StyledRemoveNFT>
          </ImageContainer>
        ))}
        <AddNFTButton>
          <Image width={24} height={24} src={XCloseIcon} alt="x-close" />
        </AddNFTButton>
      </Grid>

      <Button type="primary" size="large">
        Looks good
      </Button>
    </StyledLayout>
  );
}

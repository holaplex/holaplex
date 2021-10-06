import Button from '@/common/components/elements/Button';
import { Layout, PageHeader, Row, Col, Space } from 'antd';
import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import ArrowLeft from '@/common/assets/images/arrow-left.svg';
import XCloseIcon from '@/common/assets/images/x-close.svg';

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

export default function BulkUpload() {
  return (
    <StyledLayout>
      <GoBack onClick={() => console.log('go back')}>
        <Image width={24} height={24} src={ArrowLeft} alt="arrow-left" />
      </GoBack>
      <XClose onClick={() => console.log('go to first')}>
        <Image width={24} height={24} src={XCloseIcon} alt="x-close" />
      </XClose>

      <Header>Do these look right?</Header>
      <Grid>
        {imageLinks.map((i) => (
          <Image width={120} height={120} src={i} alt="test-image" />
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

import Button from '@/common/components/elements/Button';
import { Layout, PageHeader } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';

const StyledLayout = styled(Layout)`
  background: #000000;
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

const Copy = styled.p`
  font-family: Nunito Sans;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 27px;
  letter-spacing: 0em;
  text-align: center;
`;
// const DropZone = styled();

// TODO: we have this as a separate next.js page route for now, but eventually we would like to modalize it when we know where it kicks off
// Wizardize as well
export default function BulkUpload() {
  return (
    <StyledLayout>
      <Header>Add images or videos to create NFTs</Header>

      <Copy>Drag up to 10 pngs, jpegs, gifs, or video files here.</Copy>
      <Button type="primary" size="large">
        Browse Files
      </Button>
    </StyledLayout>
  );
}

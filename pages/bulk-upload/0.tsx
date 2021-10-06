import Button from '@/common/components/elements/Button';
import { Layout, PageHeader, Space } from 'antd';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';

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

const Copy = styled.p<{ transparent?: boolean }>`
  color: #fff;
  font-family: Nunito Sans;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 27px;
  letter-spacing: 0em;
  text-align: center;
  ${(p) => (p.transparent ? 'opacity: 0.6;' : null)}
`;

const DropZone = styled(Space)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 856px;
  height: 362px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px dashed rgba(255, 255, 255, 0.2);
  box-sizing: border-box;
  border-radius: 8px;
`;

// TODO: we have this as a separate next.js page route for now, but eventually we would like to modalize it when we know where it kicks off
// Wizardize as well
export default function BulkUpload() {
  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    console.log('acceptedFiles', acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    noClick: true,
    maxFiles: 10,
    accept: 'image/jpeg, image/png, image/gif',
  });

  return (
    <StyledLayout>
      <Header>Add images or videos to create NFTs</Header>

      <DropZone {...getRootProps()}>
        <input {...getInputProps()} />
        <Copy>Drag up to 10 pngs, jpegs, gifs, or video files here.</Copy>
        <Copy transparent>or</Copy>
        <Button type="primary" size="large" onClick={open}>
          Browse Files
        </Button>
      </DropZone>
    </StyledLayout>
  );
}

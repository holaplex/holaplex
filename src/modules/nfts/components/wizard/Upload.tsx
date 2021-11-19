import Button from '@/common/components/elements/Button';
import { Layout, PageHeader, Space, Upload, message } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { StepWizardChildProps } from 'react-step-wizard';
import { MintDispatch } from 'pages/nfts/new';
import { DraggerProps } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
const { Dragger } = Upload;

export const MAX_IMAGES = 10;
// For reference https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept
export const NFT_MIME_TYPE_UPLOAD_VALIDATION_STRING =
  'image/jpeg,image/png,image/gif,image/svg+xml';

const StyledLayout = styled(Layout)`
  display: flex;
  align-items: center;
  @media only screen and (min-width: 768px) {
    padding: 61px 142px 97px;
  }
`;

const Header = styled(PageHeader)`
  font-style: normal;
  font-weight: 900;
  font-size: 3rem;
  line-height: 3rem;
  text-align: center;
  color: #fff;
  width: 100%;

  @media only screen and (min-width: 768px) {
    width: 701px;
  }
`;

const Copy = styled.p<{ transparent?: boolean }>`
  color: #fff;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 27px;
  letter-spacing: 0em;
  text-align: center;
  ${(p) => (p.transparent ? 'opacity: 0.6;' : null)}
`;

const StyledSpace = styled(Space)`
  max-width: 80%;
  @media only screen and (min-width: 768px) {
    padding: 101px;
    width: 856px;
  }
`;

interface Props extends Partial<StepWizardChildProps> {
  dispatch: MintDispatch;
  images: Array<File>;
}

export default function UploadStep({ nextStep, dispatch, images }: Props) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  let count = 0;

  const draggerProps: DraggerProps = {
    name: 'file',
    maxCount: MAX_IMAGES, // doesn't actually seem to do anything, hence the checks in other places
    fileList,
    multiple: true,
    accept: NFT_MIME_TYPE_UPLOAD_VALIDATION_STRING,
    showUploadList: false,
    style: {
      background: 'rgba(255,255,255,0.1)',
      border: '1px dashed rgba(255, 255, 255, 0.2)',
      boxSizing: 'border-box',
      marginTop: 50,
    },

    onChange(info) {
      count++;
      console.log('on change', count, info.fileList.length);
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        console.log(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        console.log(`${info.file.name} file upload failed.`);
      }
      if (count === info.fileList.length) {
        setFileList([]); // reset local File upload state
        nextStep!();
      }
    },
    beforeUpload: (file, list) => {
      dispatch({ type: 'ADD_IMAGE', payload: file });

      return false;
    },
  };

  return (
    <StyledLayout>
      <Header>Add images to create NFTs</Header>
      <Dragger {...draggerProps}>
        <StyledSpace direction="vertical" size={24}>
          <Copy>Drag up to 10 pngs, jpegs, or gifs here.</Copy>
          <Copy transparent>or</Copy>
          <Button type="primary" size="large">
            Browse Files
          </Button>
        </StyledSpace>
      </Dragger>
    </StyledLayout>
  );
}

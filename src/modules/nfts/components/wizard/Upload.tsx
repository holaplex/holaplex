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
const StyledLayout = styled(Layout)`
  display: flex;
  align-items: center;
  padding: 61px 142px 97px;
`;

const Header = styled(PageHeader)`
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
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 27px;
  letter-spacing: 0em;
  text-align: center;
  ${(p) => (p.transparent ? 'opacity: 0.6;' : null)}
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
    maxCount: MAX_IMAGES, // doesn't actually seem to do anything, hence the checkes in other places
    fileList,
    multiple: true,
    accept: 'image/jpeg,image/png,image/gif',
    showUploadList: false,
    style: {
      // TODO: work on responsiveness
      width: '856px',
      background: 'rgba(255,255,255,0.1)',
      border: '1px dashed rgba(255, 255, 255, 0.2)',
      boxSizing: 'border-box',
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
        nextStep!();
        setFileList([]); // reset local File upload state
      }
    },
    beforeUpload: (file, list) => {
      const isUniqueFile = images.every((i) => i.name !== file.name);
      if (isUniqueFile && images.length < 11) {
        dispatch({ type: 'ADD_IMAGE', payload: file });
      }
      return false;
    },
  };

  return (
    <StyledLayout>
      <Header>Add images to create NFTs</Header>
      <Dragger {...draggerProps}>
        <div
          style={{
            display: 'flex',
            width: 420,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            margin: '0 auto',
            padding: '40px 0',
            height: 250,
          }}
        >
          <Copy>Drag up to 10 pngs, jpegs, or gifs here.</Copy>
          <Copy transparent>or</Copy>
          <Button type="primary" size="large">
            Browse Files
          </Button>
        </div>
      </Dragger>
    </StyledLayout>
  );
}

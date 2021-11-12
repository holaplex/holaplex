import Button from '@/common/components/elements/Button';
import { Layout, PageHeader, Space, Upload, message } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';
import { StepWizardChildProps } from 'react-step-wizard';
import { MintDispatch } from 'pages/nfts/new';
const { Dragger } = Upload;
import { DraggerProps } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';

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

const StyledDragger = styled(Dragger)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 856px;
  height: 362px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px dashed rgba(255, 255, 255, 0.2);
  box-sizing: border-box;
  border-radius: 8px;
  background: black;
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

interface Props extends Partial<StepWizardChildProps> {
  dispatch: MintDispatch;
  images: Array<File>;
}

export default function UploadStep({ nextStep, dispatch, images }: Props) {
  // const onDrop = useCallback(
  //   (acceptedFiles) => {
  //     dispatch({ type: 'SET_IMAGES', payload: acceptedFiles });
  //     nextStep!();
  //   },
  //   [dispatch, nextStep]
  // );

  // const { getRootProps, getInputProps, open } = useDropzone({
  //   onDrop,
  //   noClick: true,
  //   maxFiles: MAX_IMAGES,
  //   accept: 'image/jpeg, image/png, image/gif',
  // });

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  let count = 0;

  const draggerProps: DraggerProps = {
    name: 'file',
    fileList,
    multiple: true,
    accept: 'image/jpeg,image/png,image/gif',
    showUploadList: false,
    // action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',

    style: {
      //     display: flex;
      // flex-direction: column;
      // justify-content: center;
      width: '856px',
      background: 'rgba(255,255,255,0.1)',
      // width: '100%',
      // height: '100%',
      // padding: "0",
      border: '1px dashed rgba(255, 255, 255, 0.2)',
      boxSizing: 'border-box',

      // borderRadius: "8px",
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
        setFileList([]);
      }
    },
    beforeUpload: (file, list) => {
      const isUniqueFile = images.every((i) => i.name !== file.name);
      if (isUniqueFile) {
        dispatch({ type: 'ADD_IMAGE', payload: file });
      }
      // nextStep!();
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

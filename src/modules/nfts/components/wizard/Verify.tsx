import Button from '@/common/components/elements/Button';
import { PageHeader, Upload, Space } from 'antd';
import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import XCloseIcon from '@/common/assets/images/x-close.svg';
import { StepWizardChildProps } from 'react-step-wizard';
import NavContainer from '@/modules/nfts/components/wizard/NavContainer';
import { MintDispatch } from 'pages/nfts/new';
import {
  MAX_FILES,
  NFT_MIME_TYPE_UPLOAD_VALIDATION_STRING,
  MAX_FILE_SIZE,
} from '@/modules/nfts/components/wizard/Upload';
import { NFTPreviewGrid } from '@/common/components/elements/NFTPreviewGrid';

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

interface Props extends Partial<StepWizardChildProps> {
  files: Array<File>;
  dispatch: MintDispatch;
  clearForm: () => void;
}

export default function Verify({
  previousStep,
  nextStep,
  dispatch,
  goToStep,
  files,
  clearForm,
}: Props) {
  const removeFile = (fileName: string) => {
    dispatch({ type: 'DELETE_FILE', payload: fileName });
  };

  const handlePrevious = () => {
    clearForm();
    previousStep!();
  };

  return (
    <NavContainer previousStep={handlePrevious} goToStep={goToStep}>
      <Space direction="vertical" size={80} align="center">
        <Header>Do these look right?</Header>
        <NFTPreviewGrid removeFile={removeFile} files={files} width={5}>
          {files.length < MAX_FILES && (
            <Upload
              accept={NFT_MIME_TYPE_UPLOAD_VALIDATION_STRING}
              showUploadList={false}
              beforeUpload={(f) => {
                const { size, name } = f;
                if (size && size > MAX_FILE_SIZE) {
                  window.alert(
                    `The file name ${name} you are trying to upload is ${(size / 1000000).toFixed(
                      0
                    )}MB, only files equal to or under ${MAX_FILE_SIZE / 1000000}MB are allowed`
                  );
                  return;
                }
                dispatch({ type: 'ADD_FILE', payload: f });
              }}
            >
              <AddNFTButton>
                <Image width={24} height={24} src={XCloseIcon} alt="x-close" />
              </AddNFTButton>
            </Upload>
          )}
        </NFTPreviewGrid>
        <Button type="primary" size="large" onClick={nextStep}>
          Looks good
        </Button>
      </Space>
    </NavContainer>
  );
}

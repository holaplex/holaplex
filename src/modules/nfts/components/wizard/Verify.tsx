import Button from '@/common/components/elements/Button';
import { PageHeader, Space, Upload } from 'antd';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import XCloseIcon from '@/common/assets/images/x-close.svg';
import RedXClose from '@/common/assets/images/red-x-close.svg';
import { StepWizardChildProps } from 'react-step-wizard';
import { useDropzone } from 'react-dropzone';
import NavContainer from '@/modules/nfts/components/wizard/NavContainer';
import { MintDispatch } from 'pages/nfts/new';
import { MAX_IMAGES } from '@/modules/nfts/components/wizard/Upload';
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

const Grid = styled(Space)`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  width: 701px;
  column-gap: 24px;
  margin: 59px 0 83px;
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
  dispatch: MintDispatch;
}

function findDuplicates(name: string, images: Array<File>) {
  const regex = new RegExp(`${name}_[0-9]+.[A-z]*`);
  const duplicates = images.filter((i) => regex.test(i.name));

  return duplicates;
}

export default function Verify({ previousStep, nextStep, dispatch, goToStep, images }: Props) {
  const removeImage = (imageName: string) => {
    dispatch({ type: 'DELETE_IMAGE', payload: imageName });
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      console.log(acceptedFiles, acceptedFiles.length);

      for (const file of acceptedFiles) {
        let uploadedImage = file;
        if (images.some((i) => i.name === uploadedImage.name)) {
          const imageNameWithoutExt = uploadedImage.name.replace(/\.[^/.]+$/, ''); //
          const duplicates = findDuplicates(imageNameWithoutExt, images);
          const fileExtension = uploadedImage.name.split('.').pop();
          let newName = `${imageNameWithoutExt}_1.${fileExtension}`;

          if (duplicates.length > 0) {
            const lastItem = duplicates.pop();
            if (lastItem) {
              const lastItemName = lastItem.name.replace(/\.[^/.]+$/, '');
              const count = Number(lastItemName.slice(-1));
              newName = `${imageNameWithoutExt}_${count + 1}.${fileExtension}`;
            }
          }

          uploadedImage = new File([uploadedImage], newName, { type: uploadedImage.type });
        }

        console.log('uploadedImage', uploadedImage);
        dispatch({ type: 'ADD_IMAGE', payload: uploadedImage });
      }
    },
    [dispatch, images]
  );

  const { open, getInputProps } = useDropzone({
    onDrop,
    noClick: true,
    maxFiles: MAX_IMAGES - images.length,
    accept: 'image/jpeg, image/png, image/gif',
  });

  return (
    <NavContainer previousStep={previousStep} goToStep={goToStep}>
      <Header>Do these look right?</Header>
      <NFTPreviewGrid removeImage={removeImage} images={images} width={5}>
        {images.length < MAX_IMAGES && (
          <Upload
            showUploadList={false}
            beforeUpload={(f) => dispatch({ type: 'ADD_IMAGE', payload: f })}
          >
            <AddNFTButton>
              <input {...getInputProps()} />
              <Image width={24} height={24} src={XCloseIcon} alt="x-close" />
            </AddNFTButton>
          </Upload>
        )}
      </NFTPreviewGrid>
      <Button type="primary" size="large" onClick={nextStep}>
        Looks good
      </Button>
    </NavContainer>
  );
}

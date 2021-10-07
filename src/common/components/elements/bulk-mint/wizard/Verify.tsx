import Button from '@/common/components/elements/Button';
import { PageHeader, Space } from 'antd';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import XCloseIcon from '@/common/assets/images/x-close.svg';
import RedXClose from '@/common/assets/images/red-x-close.svg';
import { StepWizardChildProps } from 'react-step-wizard';
import { ImageAction } from 'pages/bulk-upload/0';
import { useDropzone } from 'react-dropzone';
import NavContainer from '@/common/components/elements/bulk-mint/wizard/NavContainer';

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
  dispatch: (payload: ImageAction) => void;
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
      let uploadedImage = acceptedFiles[0];

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
    },
    [dispatch, images],
  );

  const { open, getInputProps } = useDropzone({
    onDrop,
    noClick: true,
    maxFiles: 1,
    accept: 'image/jpeg, image/png, image/gif',
  });

  return (
    <NavContainer previousStep={previousStep} goToStep={goToStep}>
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

            <StyledRemoveNFT onClick={() => removeImage(i.name)}>
              <Image width={24} height={24} src={RedXClose} alt="remove-nft" />
            </StyledRemoveNFT>
          </ImageContainer>
        ))}
        {images.length < 10 ? (
          <AddNFTButton onClick={open}>
            <input {...getInputProps()} />
            <Image width={24} height={24} src={XCloseIcon} alt="x-close" />
          </AddNFTButton>
        ) : null}
      </Grid>

      <Button type="primary" size="large">
        Looks good
      </Button>
    </NavContainer>
  );
}

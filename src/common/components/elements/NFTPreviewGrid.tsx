import styled from 'styled-components';
import Image from 'next/image';
import GreenCheckIcon from '@/common/assets/images/green-check.svg';
import RedXClose from '@/common/assets/images/red-x-close.svg';
//@ts-ignore
import FeatherIcon from 'feather-icons-react';
import { MintStatus, NFTValue } from 'pages/nfts/new';
import { Image as AntImage } from 'antd';
import { isAudio, isImage, isVideo } from '@/modules/utils/files';

const CheckWrapper = styled.div`
  position: relative;
  height: 24px;
  width: 24px;
  top: -74px;
  right: -47px;
`;

const ImageOverlay = styled.div<{ isFinished?: boolean; isCurrent?: boolean }>`
  height: 120px;
  width: 120px;
  display: flex;
  justify-content: center;

  ${({ isFinished }) => isFinished && 'opacity: 0.5;'}

  ${({ isCurrent }) =>
    isCurrent &&
    `
      
      .ant-image-img {
        border: 2px solid #d24089; 
        border-radius: 4px;
      }
      
    `}
`;

const StyledRemoveNFT = styled.div`
  position: absolute;
  top: -9px;
  right: -9px;
  display: none;
  cursor: pointer;
`;

const FilePreviewContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  &:hover {
    ${StyledRemoveNFT} {
      display: block;
    }
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: ${(props: { width: number }) => '1fr '.repeat(props.width)};
  grid-template-rows: min-content min-content;
  column-gap: 8px;
  row-gap: 16px;
  max-height: 500px;
`;

const getOverlayStatus = (index: number, nftValues?: NFTValue[]) => {
  const nftValue = nftValues && nftValues[index];
  const showFailedOverlay = nftValue && nftValue.mintStatus === MintStatus.FAILED;

  return showFailedOverlay ? (
    <CheckWrapper>
      <Image width={24} height={24} src={RedXClose} alt="failed" />
    </CheckWrapper>
  ) : (
    <CheckWrapper>
      <Image width={24} height={24} src={GreenCheckIcon} alt="green-check" />
    </CheckWrapper>
  );
};

const StyledAntDImage = styled(AntImage)`
  object-fit: cover;
`;

const getFilePreview = (file: File) => {
  if (isAudio(file)) {
    return <FeatherIcon icon="image" />;
  }

  if (isVideo(file)) {
    return <FeatherIcon icon="video" />;
  }

  if (isImage(file)) {
    return (
      <StyledAntDImage
        src={URL.createObjectURL(file)}
        alt={file.name}
        // objectFit="cover"
        // unoptimized={true}
      />
    );
  }
};

interface Props {
  files: Array<File>;
  index?: number;
  width?: number;
  removeFile?: (id: string) => void;
  children?: any;
  isMintStep?: boolean;
  nftValues?: NFTValue[];
}

export const NFTPreviewGrid = ({
  files,
  index = -1,
  width = 2,
  removeFile,
  children,
  nftValues,
}: Props) => {
  return (
    <Grid width={width}>
      {files.map((file, i) => (
        <ImageOverlay key={file.name} isFinished={i < index} isCurrent={i === index}>
          {removeFile ? (
            <FilePreviewContainer key={file.name}>
              {getFilePreview(file)}
              <StyledRemoveNFT onClick={() => removeFile(file.name)}>
                <Image width={24} height={24} src={RedXClose} alt="remove-nft" />
              </StyledRemoveNFT>
            </FilePreviewContainer>
          ) : (
            getFilePreview(file)
          )}
          {i < index && getOverlayStatus(i, nftValues)}
        </ImageOverlay>
      ))}
      {children}
    </Grid>
  );
};

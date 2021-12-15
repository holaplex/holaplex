import styled from 'styled-components';
import Image from 'next/image';
import GreenCheckIcon from '@/common/assets/images/green-check.svg';
import RedXClose from '@/common/assets/images/red-x-close.svg';
//@ts-ignore
import FeatherIcon from 'feather-icons-react';
import { FilePreview, MintStatus, NFTValue } from 'pages/nfts/new';
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
  align-items: center;

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

const getFilePreview = (fp: FilePreview) => {
  if (isAudio(fp)) {
    return <FeatherIcon icon="image" />;
  }

  if (isVideo(fp)) {
    return <FeatherIcon icon="video" />;
  }

  if (isImage(fp)) {
    return (
      <StyledAntDImage
        src={URL.createObjectURL(fp.file)}
        alt={fp.file.name}
        // objectFit="cover"
        // unoptimized={true}
      />
    );
  }
};

interface Props {
  filePreviews: Array<FilePreview>;
  index?: number;
  width?: number;
  children?: any;
  nftValues?: NFTValue[];
}

export const NFTPreviewGrid = ({
  filePreviews,
  index = -1,
  width = 2,
  children,
  nftValues,
}: Props) => {
  return (
    <Grid width={width}>
      {filePreviews.map((fp, i) => (
        <ImageOverlay key={fp.file.name} isFinished={i < index} isCurrent={i === index}>
          {getFilePreview(fp)}
          {i < index && getOverlayStatus(i, nftValues)}
        </ImageOverlay>
      ))}
      {children}
    </Grid>
  );
};

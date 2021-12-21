import styled from 'styled-components';
import Image from 'next/image';
import GreenCheckIcon from '@/common/assets/images/green-check.svg';
import RedXClose from '@/common/assets/images/red-x-close.svg';
//@ts-ignore
import FeatherIcon from 'feather-icons-react';
import { FilePreview, MintStatus, NFTValue } from 'pages/nfts/new';
import { Image as AntImage } from 'antd';
import { is3DFilePreview, isAudio, isImage, isVideo } from '@/modules/utils/files';
import React, { useRef, useState } from 'react';
import { StyledModal } from '@/common/components/elements/VerifyFileUpload';

const CheckWrapper = styled.div`
  position: relative;
  height: 24px;
  width: 24px;
  top: -74px;
  right: -47px;
`;

const ImageOverlay = styled.div<{ isFinished?: boolean; isCurrent?: boolean }>`
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

export const VidAudPrevWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
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
  width: 120px;
  height: 120px;
`;

const StyledPreviewOverlay = styled.div`
  position: relative;
  max-height: 120px; // Margin collapse really being annoying
`;

const PrevSvgWrapper = styled.div`
  position: absolute;
  background: black;
  border-radius: 15px;
  bottom: 13px;
  left: 6px;
  z-index: 10;
  height: 25%;
  width: 25%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PreviewOverlay = ({ children }: { children: React.ReactElement }) => {
  return (
    <StyledPreviewOverlay>
      <PrevSvgWrapper>
        <FeatherIcon icon="youtube" />
      </PrevSvgWrapper>

      {children}
    </StyledPreviewOverlay>
  );
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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentFile, setCurrentFile] = useState<File>();
  const vidRef = useRef<HTMLVideoElement>(null);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);

    if (vidRef.current) {
      vidRef.current.pause();
    }
  };

  const getFilePreview = (fp: FilePreview) => {
    if (isAudio(fp)) {
      return (
        <VidAudPrevWrapper
          onClick={() => {
            setCurrentFile(fp.file);
            showModal();
          }}
        >
          {fp.coverImage ? (
            <PreviewOverlay>
              <StyledAntDImage
                src={URL.createObjectURL(fp.coverImage)}
                alt={fp.file.name}
                preview={false}
              />
            </PreviewOverlay>
          ) : (
            <FeatherIcon icon="volume-2" />
          )}
        </VidAudPrevWrapper>
      );
    }

    if (isVideo(fp)) {
      return (
        <VidAudPrevWrapper
          onClick={() => {
            setCurrentFile(fp.file);
            showModal();
          }}
        >
          {fp.coverImage ? (
            <PreviewOverlay>
              <StyledAntDImage
                src={URL.createObjectURL(fp.coverImage)}
                alt={fp.file.name}
                preview={false}
              />
            </PreviewOverlay>
          ) : (
            <FeatherIcon icon="youtube" />
          )}
        </VidAudPrevWrapper>
      );
    }

    if (is3DFilePreview(fp)) {
      return <FeatherIcon icon="box" />;
    }

    if (isImage(fp)) {
      return <StyledAntDImage src={URL.createObjectURL(fp.file)} alt={fp.file.name} />;
    }
  };
  return (
    <>
      <StyledModal
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleOk}
        closable={false}
        cancelButtonProps={{ style: { display: 'none' } }}
        keyboard={true}
        destroyOnClose={true}
      >
        {currentFile && isModalVisible && (
          <video
            className="holaplex-video-content"
            playsInline={true}
            autoPlay={true}
            controls={true}
            controlsList="nodownload"
            loop={true}
            style={{ maxWidth: 800 }}
            ref={vidRef}
            key={currentFile.name}
          >
            <source src={URL.createObjectURL(currentFile)} type={currentFile.type} />
          </video>
        )}
      </StyledModal>
      <Grid width={width}>
        {filePreviews.map((fp, i) => (
          <ImageOverlay key={fp.file.name} isFinished={i < index} isCurrent={i === index}>
            {getFilePreview(fp)}
            {i < index && getOverlayStatus(i, nftValues)}
          </ImageOverlay>
        ))}
        {children}
      </Grid>
    </>
  );
};

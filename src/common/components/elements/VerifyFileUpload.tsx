import styled from 'styled-components';
import Image from 'next/image';
import RedXClose from '@/common/assets/images/red-x-close.svg';
import { Image as AntImage, Modal } from 'antd';
import { isAudio, isImage, isVideo } from '@/modules/utils/files';
//@ts-ignore
import FeatherIcon from 'feather-icons-react';
import React, { useRef, useState } from 'react';

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
  justify-content: center;
  align-items: center;
  width: 100%;

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

const StyledAntDImage = styled(AntImage)`
  object-fit: cover;
`;

const StyledModal = styled(Modal)`
  justify-content: center;
  display: flex;
  width: 100%;
  .ant-modal-content {
    display: inline-block;
  }

  .ant-modal-close {
  }
`;

const VidAudPrevWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

interface Props {
  files: Array<File>;
  index?: number;
  width?: number;
  removeFile: (id: string) => void;
  children?: any;
}

export const VerifyFileUpload = ({ files, index = -1, width = 2, removeFile, children }: Props) => {
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

  const getFilePreview = (file: File) => {
    if (isAudio(file)) {
      return (
        <VidAudPrevWrapper
          onClick={() => {
            setCurrentFile(file);
            showModal();
          }}
        >
          <FeatherIcon icon="headphones" />
        </VidAudPrevWrapper>
      );
    }

    if (isVideo(file)) {
      return (
        <VidAudPrevWrapper
          onClick={() => {
            setCurrentFile(file);
            showModal();
          }}
        >
          <FeatherIcon icon="video" />
        </VidAudPrevWrapper>
      );
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
  return (
    <>
      {isModalVisible}
      <StyledModal
        visible={isModalVisible}
        onOk={handleOk}
        closable={false}
        cancelButtonProps={{ style: { display: 'none' } }}
        keyboard={true}
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
        {files.map((file, i) => (
          <ImageOverlay key={file.name} isFinished={i < index} isCurrent={i === index}>
            <FilePreviewContainer key={file.name}>
              {getFilePreview(file)}
              <StyledRemoveNFT onClick={() => removeFile(file.name)}>
                <Image width={24} height={24} src={RedXClose} alt="remove-nft" />
              </StyledRemoveNFT>
            </FilePreviewContainer>
          </ImageOverlay>
        ))}
        {children}
      </Grid>
    </>
  );
};

import styled from 'styled-components';
import Image from 'next/image';
import RedXClose from '@/common/assets/images/red-x-close.svg';
import { Image as AntImage, Modal } from 'antd';
import { is3DFile, is3DFilePreview, isAudio, isImage, isVideo } from '@/modules/utils/files';
//@ts-ignore
import FeatherIcon from 'feather-icons-react';
import React, { useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const ModelViewer = dynamic(() => import('./ModelViewer'), { ssr: false });

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

const PrevSubTitle = styled.p`
  opacity: 0.6;
  font-size: 14px;
  margin-top: 5px;
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

export const StyledModal = styled(Modal)`
  justify-content: center;
  display: flex;
  width: 100%;
  .ant-modal-content {
    display: inline-block;
  }

  .ant-modal-close {
  }
`;

export const VidAudPrevWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
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

const VerifyFileUpload = ({ files, index = -1, width = 2, removeFile, children }: Props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentFile, setCurrentFile] = useState<File>();
  const vidRef = useRef<HTMLVideoElement>(null);

  const showVidAudPreview = currentFile && (isVideo(currentFile) || isAudio(currentFile));
  const show3DFilePreview = currentFile && is3DFile(currentFile);

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
          <FeatherIcon icon="volume-2" />
          <PrevSubTitle>{file.name}</PrevSubTitle>
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
          <PrevSubTitle>{file.name}</PrevSubTitle>
        </VidAudPrevWrapper>
      );
    }

    if (is3DFile(file)) {
      return (
        <VidAudPrevWrapper
          onClick={() => {
            setCurrentFile(file);
            showModal();
          }}
        >
          <FeatherIcon icon="box" />
        </VidAudPrevWrapper>
      );
    }

    if (isImage(file)) {
      return <StyledAntDImage src={URL.createObjectURL(file)} alt={file.name} />;
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
      >
        {showVidAudPreview && currentFile && (
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
        {show3DFilePreview && currentFile && (
          <ModelViewer
            src={URL.createObjectURL(currentFile)}
            alt={currentFile.name}
            shadow-intensity="1"
            camera-controls
            auto-rotate
            ar
          />
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

export default VerifyFileUpload;

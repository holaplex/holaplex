import styled from "styled-components";
import Image from "next/image";
import GreenCheckIcon from "@/common/assets/images/green-check.svg";

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: min-content min-content;
  width: 216px;
  column-gap: 16px;
  row-gap: 16px;
  max-height: 500px;
`;

const CheckWrapper = styled.div`
  position: relative;
  height: 24px;
  width: 24px;
  top: -68px;
  right: -42px;
`;

const ImageOverlay = styled.div<{ isFinished?: boolean; isCurrent?: boolean }>`
  height: 108px;
  width: 108px;
  border-radius: 4px;
  padding: 4px;
  ${({ isCurrent }) => (isCurrent ? "border: 2px solid #d24089;;" : null)}
  ${({ isFinished }) => (isFinished ? "opacity: 0.5;" : null)}
`;

export const NftPreviewGrid = ({
  images,
  index = -1,
}: {
  images: Array<File>;
  index?: number;
}) => {
  return (
    <Grid>
      {images.map((image, i) => (
        <ImageOverlay
          key={image.name}
          isFinished={i < index}
          isCurrent={i === index}
        >
          <Image
            width={100}
            height={100}
            src={URL.createObjectURL(image)}
            alt={image.name}
            unoptimized={true}
          />

          {i < index && (
            <CheckWrapper>
              <Image
                width={24}
                height={24}
                src={GreenCheckIcon}
                alt="green-check"
              />
            </CheckWrapper>
          )}
        </ImageOverlay>
      ))}
    </Grid>
  );
};

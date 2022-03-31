import styled from 'styled-components';

export const LoadingContainer = styled.div<{ $borderRadius?: '8px' | '100%' }>`
  background: #707070;
  border-radius: ${({ $borderRadius }) => $borderRadius || '8px'};
  -webkit-mask: linear-gradient(-60deg, #000 30%, #000a, #000 70%) right/300% 100%;
  animation: shimmer 2.5s infinite;
  @keyframes shimmer {
    100% {
      -webkit-mask-position: left;
    }
  }
`;

export const LoadingBox = styled.div<{ $borderRadius?: '8px' | '100%' }>`
  width: 80px;
  height: 80px;
  background: #707070;
  border-radius: ${({ $borderRadius }) => $borderRadius || '8px'};
  -webkit-mask: linear-gradient(-60deg, #000 30%, #000a, #000 70%) right/300% 100%;
  animation: shimmer 2.5s infinite;
  @keyframes shimmer {
    100% {
      -webkit-mask-position: left;
    }
  }
`;

export const LoadingLine = styled.div<{ $width?: string; $height?: string }>`
  width: ${({ $width }) => $width || '100%'};
  height: ${({ $height }) => $height || '24px'};
  background: #707070;
  border-radius: 4px;
  margin-top: 8px;
  -webkit-mask: linear-gradient(-60deg, #000 30%, #000a, #000 70%) right/400% 100%;
  animation: shimmer 2.5s infinite;
  @keyframes shimmer {
    100% {
      -webkit-mask-position: left;
    }
  }
`;

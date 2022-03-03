import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

const StyledSpinner = styled.svg<{ width?: number; height?: number }>`
  animation: rotate 2.5s linear infinite;
  z-index: 2;
  ${({ width, height }) => `width: ${width}px; height: ${height}px;`}

  & .path {
    stroke: hsl(210, 70, 75);
    stroke-linecap: round;
    animation: dash 2s ease-in-out infinite;
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes dash {
    0% {
      stroke-dasharray: 1, 150;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -35;
    }
    100% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -124;
    }
  }
`;

interface Props extends HTMLAttributes<HTMLDivElement> {
  height?: number;
  width?: number;
}

export const Spinner = ({ width = 32, height = 32, ...restOfProps }: Props) => {
  return (
    <div {...restOfProps}>
      <StyledSpinner
        width={width}
        height={height}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4ZM0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16Z"
          fill="#232323"
        />
        <circle stroke="#C4C4C4" className="path" cx="16" cy="16" r="13.5" strokeWidth="4"></circle>
      </StyledSpinner>
    </div>
  );
};

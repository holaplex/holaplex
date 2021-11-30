import React from 'react';
import styled from 'styled-components';

type WavingHandProps = {
  size?: number;
};
const Hand = styled.div<WavingHandProps>`
  animation: wave 2s linear infinite;
  transform-origin: 70% 70%;
  font-size: ${(props) => props.size}px;
  @keyframes wave {
    0% {
      transform: rotate(0deg);
    }
    10% {
      transform: rotate(14deg);
    }
    20% {
      transform: rotate(-8deg);
    }
    30% {
      transform: rotate(14deg);
    }
    40% {
      transform: rotate(-4deg);
    }
    50% {
      transform: rotate(10deg);
    }
    60% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
`;

export default function WavingHand({ size }: WavingHandProps) {
  return <Hand size={size || 120}>👋</Hand>;
}

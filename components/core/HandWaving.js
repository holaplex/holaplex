import React from 'react';
import styled from 'styled-components';
import FeatherIcon from 'feather-icons-react';
import sv from '../../constants/Styles';

const Hand = styled.div`
  animation: wave 2s linear infinite;
  transform-origin: 70% 70%;
  font-size: ${props => props.size}px;
  @keyframes wave {
    0% { transform: rotate( 0.0deg) }
    10% { transform: rotate(14.0deg) }
    20% { transform: rotate(-8.0deg) }
    30% { transform: rotate(14.0deg) }
    40% { transform: rotate(-4.0deg) }
    50% { transform: rotate(10.0deg) }
    60% { transform: rotate( 0.0deg) }
    100% { transform: rotate( 0.0deg) }
  }
`

export default function WavingHand({ className, size }) {
  return (
    <Hand size={size || 48}>👋</Hand>
  );
};

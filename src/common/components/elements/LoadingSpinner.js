import React from 'react';
import styled from 'styled-components';
import FeatherIcon from 'feather-icons-react';
import sv from '../../constants/Styles';

const Container = styled.div`

`;

const Icon = styled(FeatherIcon)`
  animation: rotate 1s linear infinite;

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }
`

export default function Label({ className, label, padding, light, small }) {
  return (
    <Container className={className}>
      <Icon
        icon="loader"
        size={small ? 16 : 24}
        color={light ? sv.colors.subtleText : sv.colors.text}
      />
    </Container>
  );
};

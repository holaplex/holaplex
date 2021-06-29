// @ts-nocheck
import React from 'react';
import sv from '../../constants/Styles';
import styled from 'styled-components';
import HandWaving from './HandWaving';
import {Label} from '../../constants/StyleComponents';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: #fff;
  ${sv.flexCenter}
`;

const Loading = () => {
  return (
    <Container>
      <div>
        <HandWaving />
        <Label>Loading...</Label>
      </div>
    </Container>
  )
}

export default Loading;

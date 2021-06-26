import React from 'react';
import sv from '../../constants/Styles'
import styled from 'styled-components';
import Button from './core/Button';
import Avatar from './core/Avatar';

////// STYLE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const Container = styled.div``;

////// COMPONENT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

type Props = {
  wallet: string
}

const ConnectActions = ({ wallet }: Props) => {
  return (
    <Container>
      {wallet ?
        <Avatar avatarSize={32} name="Ballz McGee" /> :
        <Button small label="Connect" />
      }
    </Container>
  )
}

export default ConnectActions;

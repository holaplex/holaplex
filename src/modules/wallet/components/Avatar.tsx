import React from 'react';
import styled from 'styled-components';
import Button from '@/components/elements/Button';
import Avatar from '@/components/elements/Avatar';

////// STYLE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const Container = styled.div``;

////// COMPONENT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

type Props = {
  wallet: string
}

const WalletAvatar = ({ wallet }: Props) => {
  return (
    <Container>
      {wallet ?
        <Avatar avatarSize={32} name="Ballz McGee" /> :
        <Button small label="Connect" />
      }
    </Container>
  )
}

export default WalletAvatar;

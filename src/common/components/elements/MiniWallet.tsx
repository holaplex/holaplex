import { ButtonReset } from '@/common/styles/ButtonReset';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Col, Row } from 'antd';
import styled from 'styled-components';

export const MiniWallet = () => {
  const { connected } = useWallet();
  return (
    <SecondaryCol>
      <SpacedRow>{!connected ? <MiniConnectionButton /> : <MiniDisconnectButton />}</SpacedRow>
    </SecondaryCol>
  );
};

const SecondaryCol = styled(Col)``;

export const MiniConnectionButton = styled(WalletMultiButton)`
  ${ButtonReset}
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
  height: auto;
`;

const MiniDisconnectButton = styled(WalletDisconnectButton)`
  ${ButtonReset}
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
  height: auto;
`;

const SpacedRow = styled(Row)`
  margin-top: 8px;
  justify-content: space-between;
`;

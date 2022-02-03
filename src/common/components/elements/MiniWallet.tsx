import { useLamportBalance } from '@/common/hooks/useLamportBalance';
import { ButtonReset } from '@/common/styles/ButtonReset';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Col, Row } from 'antd';
import styled from 'styled-components';
import { WalletLabel } from './WalletIndicator';

export const MiniWallet = () => {
  const { connected } = useWallet();
  const { data } = useLamportBalance();
  return (
    <SecondaryCol>
      <SolAmount>
        {connected && data && `${(data / LAMPORTS_PER_SOL).toFixed(2)} SOL`}&nbsp;
      </SolAmount>
      <SpacedRow>
        <WalletLabel />
        {!connected ? <MiniConnectionButton /> : <MiniDisconnectButton />}
      </SpacedRow>
    </SecondaryCol>
  );
};

const SecondaryCol = styled(Col)``;

const SolAmount = styled.span`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  color: #ffffff;
`;

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

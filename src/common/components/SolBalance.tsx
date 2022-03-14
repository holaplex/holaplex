import { useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import styled from 'styled-components';
import { useLamportBalance } from '../hooks/useLamportBalance';

export const SolBalance = () => {
  const { connected } = useWallet();
  const { data } = useLamportBalance();
  let amountToShow: string;
  if (!connected) {
    amountToShow = ' ';
  } else if (data === 0) {
    amountToShow = `0 SOL`;
  } else if (data === undefined || data === null) {
    amountToShow = ' ';
  } else if (data > 0) {
    amountToShow = `${(data / LAMPORTS_PER_SOL).toFixed(2)} SOL`;
  } else {
    amountToShow = ' ';
  }
  return <SolAmount>{amountToShow}</SolAmount>;
};

const SolAmount = styled.span`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  color: #ffffff;
`;

import React from 'react';
import styled from 'styled-components';
import sv from '@/constants/styles';
import HandWaving from './HandWaving';

const Content = styled.div`
  flex: 3;
  min-height: 550px;
  ${sv.flexCenter};
`;

type LoadingProps = {
  loading?: boolean;
  children: React.ReactElement;
};

const Loading = ({ children, loading }: LoadingProps) => {
  return loading ? (
    <Content>
      <HandWaving />
    </Content>
  ) : (
    children
  );
};

export default Loading;

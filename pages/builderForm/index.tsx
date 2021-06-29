// @ts-nocheck
import React, {useState} from 'react';
import sv from '../../constants/Styles'
import styled from 'styled-components';
import Button from '../../components/core/Button';
import TextInput from '../../components/core/TextInput';
import ConnectActions from '../../components/ConnectActions'
import NameStore from './NameStore';
import SubDomain from './SubDomain';
import CustomizeStore from './CustomizeStore';
import { useRouter } from 'next/router'
import {
  Text,
  H2,
  Actions,
  GradientContainer,
  RoundedContainer
} from '../../constants/StyleComponents'
import { StorefrontContextProvider } from '../../lib/services/context';

// >>>>> STYLES >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const Content = styled.div`
  flex: 1;
  ${sv.flexCenter};
`;

const Header = styled.div`
  flex: 0 0 ${sv.headerHeight}px;
  width: 100%;
  ${sv.flexCenter};

`;

const HeaderContent = styled.div`
  height: 100%;
  width: 100%;
  max-width: ${sv.grid*134}px;
  ${sv.flexRow};
`;

const Logo = styled.div`
  color: ${sv.colors.buttonText};
  font-size: 24px;
  font-weight: 900;
  margin-right: auto;
`;


// >>>>> COMPONENT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

export default function BuilderForm() {

  const [step, setStep] = useState(1)
  const [subDomain, setSubDomain] = useState('')

  const renderStep = (step: number) => {
    switch (step) {
      case 1:
        return <SubDomain
          nextAction={() => setStep(2)}
               />;
      case 2:
        return <CustomizeStore
          nextAction={() => setStep(3)}
          backAction={() => setStep(1)}
               />;
      default:
        return <SubDomain nextAction={() => setStep(2)} />;
    }
  };

  return (
    <StorefrontContextProvider>
      <GradientContainer>
        <Header>
          <HeaderContent>
            <Logo>👋 Holaplex</Logo>
            <ConnectActions wallet="2u4y3g2g4h5gh425gh24j5h24j5jhv25" />
          </HeaderContent>
        </Header>

        <Content>
          {renderStep(step)}
        </Content>
      </GradientContainer>
    </StorefrontContextProvider>

  )
}

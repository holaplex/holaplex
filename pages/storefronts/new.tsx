// @ts-nocheck
import React, {useState} from 'react';
import sv from '@/constants/Styles'
import styled from 'styled-components';
import ConnectActions from '@/modules/wallet/components/Avatar'
import PublishStore from '@/modules/storefront/components/PublishStore';
import SubDomain from '@/modules/storefront/components/SubDomain';
import CustomizeStore from '@/modules/storefront/components/CustomizeStore';
import PubkeyStore from '@/modules/storefront/components/PubkeyStore';
import {
  GradientContainer,
} from '@/constants/StyleComponents'
import { useRouter } from 'next/router'
import { StorefrontContextProvider } from '@/modules/storefront/components/Context';

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
  const router = useRouter()

  const [step, setStep] = useState(1)
  const [subDomain, setSubDomain] = useState('')

  const renderStep = (step: number) => {
    switch (step) {
      case 1:
        return <SubDomain nextAction={() => setStep(2)} />;
      case 2:
        return <PubkeyStore nextAction={() => setStep(3)} />;
      case 3:
        return <CustomizeStore
          nextAction={() => setStep(4)}
               />;
      case 4:
        return (
          <PublishStore
            publishNow={() => router.push("/")}
          />
        );
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

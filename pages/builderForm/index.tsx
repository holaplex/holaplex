import sv from '../../constants/Styles'
import styled from 'styled-components';
import HolaWaves from '../../assets/images/HolaWaves';
import Button from '../../components/core/Button';
import ConnectActions from '../../components/ConnectActions'
import { useRouter } from 'next/router'
import {
  Text,
  H2,
  GradientContainer,
  RoundedContainer
} from '../../constants/StyleComponents'

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

export default function builderForm() {

  return (
    <GradientContainer>
      <Header>
        <HeaderContent>
          <Logo>👋 Holaplex</Logo>
          <ConnectActions wallet="2u4y3g2g4h5gh425gh24j5h24j5jhv25" />
        </HeaderContent>
      </Header>

      <Content>
        <RoundedContainer small>
          <H2>Let’s start by naming your store.</H2>
          <Text>This is the name the people will see inside your store and also on our registry of stores.</Text>
        </RoundedContainer>
      </Content>
    </GradientContainer>

  )
}

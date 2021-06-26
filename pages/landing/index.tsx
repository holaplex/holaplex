import sv from '../../constants/Styles'
import styled from 'styled-components';
import HolaWaves from '../../assets/images/HolaWaves';
import Button from '../../components/core/Button';
import {
  Text,
  PageTitle,
  SubTitle,
  Link,
  Container
} from '../../constants/StyleComponents'

// >>>>> STYLES >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const StyledContainer = styled(Container)`
  height: 100vh;
  background: linear-gradient(128.42deg, #841896 24.41%, #4F1364 83.01%);
`;

const Content = styled.div`
  flex: 1;
  ${sv.flexCenter};
`;

const MainPitch = styled.div`
  ${sv.flexCenter};
  flex-direction: column;
  max-width: 500px;
`;

const Logo = styled.div`
  font-size: 90px;
  margin-bottom: ${sv.grid*4}px;
`;

const NewStoreButton = styled(Button)`
  margin-top: ${sv.grid*3}px;
`;

const HasStoretext = styled(Text)`
  margin-top: ${sv.grid*4}px;
  max-width: 240px;
  text-align: center;
`;

const Waves = styled(HolaWaves)`
  width: 100%;
`;

// >>>>> COMPONENT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

export default function landing() {
  return (
    <StyledContainer>
      <Content>
        <MainPitch>
          <Logo>👋</Logo>
          <PageTitle center>Holaplex</PageTitle>
          <SubTitle center>Design, launch, and host your NFT marketplace. No coding required!</SubTitle>
          <NewStoreButton label="Create Your Store" />
          <HasStoretext color={sv.colors.subtleText}>
            Already have a store? <Link>Connect Wallet</Link> to manage.
          </HasStoretext>
        </MainPitch>
      </Content>
      <Waves />
    </StyledContainer>

  )
}

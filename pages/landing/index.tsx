import sv from '../../constants/Styles'
import styled from 'styled-components';
// @ts-ignore
import { rgba } from 'polished';
import HolaWaves from '../../assets/images/HolaWaves';
import Button from '../../components/core/Button';
import Link from '../../components/core/Link'
import { useRouter } from 'next/router'
import {
  Text,
  PageTitle,
  SubTitle,
  StandardLink,
  GradientContainer
} from '../../constants/StyleComponents'

// >>>>> STYLES >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const Content = styled.div`
  flex: 1;
  ${sv.flexCenter};
`;

const MainPitch = styled.div`
  color: ${sv.colors.buttonText};
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

const HasStoreText = styled(Text)`
  margin-top: ${sv.grid*4}px;
  max-width: 240px;
  text-align: center;
`;

const Waves = styled(HolaWaves)`
  width: 100%;
`;

// >>>>> COMPONENT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

export default function Landing() {

  const router = useRouter()

  return (
    <GradientContainer>
      <Content>
        <MainPitch>
          <Logo>👋</Logo>
          {/* @ts-ignore */}
          <PageTitle center invert>Holaplex</PageTitle>
          {/* @ts-ignore */}
          <SubTitle center invert>Design, launch, and host your NFT marketplace. No coding required!</SubTitle>
          <NewStoreButton action={() => router.push('/builderForm')} label="Create Your Store" />
          <HasStoreText color={rgba(sv.colors.buttonText, .6)}>
            Already have a store? <Link invert href="/builderForm" label="Connect Wallet" /> to manage.
          </HasStoreText>
        </MainPitch>
      </Content>
      <Waves />
    </GradientContainer>

  )
}

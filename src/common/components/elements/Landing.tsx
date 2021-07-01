import sv from '@/constants/Styles'
import styled from 'styled-components';
// @ts-ignore
import { rgba } from 'polished';
import HolaWaves from '@/assets/images/HolaWaves';
import Button from './Button';
import Link from './Link'
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
  flex: 3;
  min-height: 550px;
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

const Waves = styled.div`
  width: 100%;
  flex: 0 0 40%;
  max-height: 600px;
  ${sv.flexCenter};
  svg {
    min-width: 1000px;
  }
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
          <NewStoreButton action={() => router.push('/storefronts/new')} label="Create Your Store" />
          <HasStoreText color={rgba(sv.colors.buttonText, .6)}>
            Already have a store? <Link invert href="/storefronts/new" label="Connect Wallet" /> to manage.
          </HasStoreText>
        </MainPitch>
      </Content>
      <Waves>
        <HolaWaves />
      </Waves>
    </GradientContainer>

  )
}

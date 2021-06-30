import sv from '@/constants/Styles'
import styled from 'styled-components';
import FullPageLoading from './FullPageLoading';
// @ts-ignore
import { rgba } from 'polished';

// >>>>> STYLES >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: green;
`;

// >>>>> COMPONENT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

export default function Tester() {

  return (
    <Container>
      <FullPageLoading />
    </Container>

  )
}

// import  from 'react'
import sv from '@/constants/styles'
import styled from 'styled-components'
import { Row, Col, Typography, Space } from 'antd'
import Button from '@/components/elements/Button'
import Stores from '@/components/Stores'
const {Title, Text} = Typography

const LightText = styled(Text)`
  color: rgba(255,255,255,.6);
`;

const LightTitle = styled(Title)`
  color: #ffffff !important;
`;

const Container = styled(Row)`
  padding-bottom: ${sv.sectionPadding}px;
`;

const Pitch = styled.div`
  margin: ${sv.appPadding}px 0;
  ${sv.flexRow};
  padding: ${sv.grid}px;
  align-items: flex-start;
`;

const Words = styled.div`
  flex: 1;
  margin-right: ${sv.appPadding}px;
`;

const Showcase = () => {

  return (
    <Container justify="center" align="middle">
      <Col xs={21} lg={18} xl={16} xxl={14}>
        <Pitch>
          <Words>
            <LightTitle level={3}>114 stores and counting.</LightTitle>
            <LightText>You can create your own NFT marketplace in about 5 minutes. Ready to show off what you got?</LightText>
          </Words>
          <Button
            type="primary"
            href="/"
          >
            Create Store
          </Button>
        </Pitch>
        <Stores />
      </Col>
    </Container>


  )
};

export default Showcase;

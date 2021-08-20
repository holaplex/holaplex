import {useEffect, useState} from 'react'
import sv from '@/constants/styles'
import styled from 'styled-components'
import ArweaveSDK from '@/modules/arweave/client'
import { initArweave } from '@/modules/arweave'
import { Row, Col, Typography, Space } from 'antd'
import Button from '@/components/elements/Button'
import Stores from '@/components/Stores'
const {Title, Text} = Typography
import useWindowDimensions from '@/hooks/useWindowDimensions'

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
  padding: ${sv.grid}px;
  display: ${props => props.flex ? 'flex' : 'block'};
`;

const Words = styled.div`
  flex: 1;
  margin-right: ${sv.appPadding}px;
  margin-bottom: ${sv.grid*2}px;
`;

const Showcase = () => {
  const windowDimensions = useWindowDimensions();
  const [storefronts, setStorefronts] = useState([])
  useEffect(() => {
    const arweave = initArweave()
    ArweaveSDK.using(arweave).storefront.list()
      .then(storefrontData => {
        const storefronts = storefrontData.map(st => st.storefront)
        setStorefronts(storefronts)
      })

  }, [])

  return (
    <Container justify="center" align="middle">
      <Col xs={21} lg={18} xl={16} xxl={14}>
        <Pitch flex={windowDimensions.width > 650}>
          <Words>
            <LightTitle level={3}>{storefronts ? storefronts.length : 'A lot of'} stores and counting.</LightTitle>
            <LightText>You can create your own NFT marketplace in about 5 minutes. Ready to show off what you got?</LightText>
          </Words>
          <Button
            type="primary"
            href="/"
          >
            Create Store
          </Button>
        </Pitch>
        <Stores stores={storefronts} />
      </Col>
    </Container>


  )
};

export default Showcase;

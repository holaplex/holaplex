import { useEffect, useState, useContext } from 'react'
import sv from '@/constants/styles'
import styled from 'styled-components'
import ArweaveSDK from '@/modules/arweave/client'
import { initArweave } from '@/modules/arweave'
import { Grid } from 'antd-mobile'
import { Row, Col, Typography, Space } from 'antd'
import Button from '@/components/elements/Button'
import { WalletContext } from '@/modules/wallet'
import Loading from '@/components/elements/Loading'
import type { Storefront } from '@/modules/storefront/types'
const { Title, Text } = Typography
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

const Pitch = styled.div<{ flex: boolean; }>`
  margin: ${sv.appPadding}px 0;
  padding: ${sv.grid}px;
  display: ${props => props.flex ? 'flex' : 'block'};
`;

const Words = styled.div`
  flex: 1;
  margin-right: ${sv.appPadding}px;
  margin-bottom: ${sv.grid * 2}px;
`;

type StoreProps = {
  bgColor: string;
}
const Store = styled.a`
  ${sv.flexCenter};
  flex-direction: column;
  transition: all .2s ease;
  padding: ${sv.grid * 2}px;
  ${sv.borderRadius};
  margin: ${sv.grid}px;
  background-color: ${({ bgColor }: StoreProps) => bgColor};
  ${sv.shadow};
  cursor: pointer;
  img {
    border-radius: 4px;
  }
  &:hover {
    transform: translate(0, -4px);
    box-shadow: 0 8px 16px rgba(0,0,0,.5);
  }
`;

type StoreNameProps = {
  color: string;
}
const StoreName = styled(Text)`
  width: 100%;
  ${sv.label};
  text-align: center;
  margin-top: ${sv.grid}px;
  color: ${({ color }: StoreNameProps) => color};
`;


const StoreFronts = () => {
  const { connect } = useContext(WalletContext)

  const windowDimensions = useWindowDimensions();
  const [loading, setLoading] = useState(true)
  const [storefronts, setStorefronts] = useState<Storefront[]>([])

  useEffect(() => {
    const arweave = initArweave()
    ArweaveSDK.using(arweave).storefront.list()
      .then(storefrontData => {
        const storefronts = storefrontData.map(st => st.storefront)
        setStorefronts(storefronts)
        setLoading(false)
      })

  }, [])

  const columnNumber = windowDimensions.width < 800 ? 2 : 4

  return (
    <Container justify="center" align="middle">
      <Col xs={21} lg={18} xl={16} xxl={14}>
        <Loading loading={loading}>
          <>
            <Pitch flex={windowDimensions.width > 650}>
              <Words>
                <LightTitle level={3}>{storefronts.length} stores and counting.</LightTitle>
                <LightText>You can create your own NFT marketplace in about 5 minutes. Ready to show off what you got?</LightText>
              </Words>
              <Button
                type="primary"
                onClick={connect}
              >
                Create Store
              </Button>
            </Pitch>
            <Grid
              itemStyle={{ display: 'inline-block' }}
              data={storefronts}
              columnNum={columnNumber}
              renderItem={storefront => {
                return (
                  <Store
                    bgColor={storefront?.theme.backgroundColor}
                    href={`https://${storefront?.subdomain}.holaplex.com`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src={storefront?.theme.logo.url} style={{ width: '75px', height: '75px' }} alt="" />
                    <StoreName
                      ellipsis
                      color={storefront?.theme.primaryColor}
                    >
                      {storefront?.meta.title}
                    </StoreName>
                  </Store>
                )
              }}
            />
          </>
        </Loading>
      </Col>
    </Container>

  )
};

export default StoreFronts;

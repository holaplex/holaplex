import { useEffect, useState, useContext } from 'react'
import sv from '@/constants/styles'
import styled from 'styled-components'
import ArweaveSDK from '@/modules/arweave/client'
import { initArweave } from '@/modules/arweave'
import { replace } from 'ramda'
import { Row, Col, Typography, Space, List, Image } from 'antd'
import Button from '@/components/elements/Button'
import { WalletContext } from '@/modules/wallet'
import Loading from '@/components/elements/Loading'
import type { Storefront } from '@/modules/storefront/types'
const { Title, Text } = Typography
import useWindowDimensions from '@/hooks/useWindowDimensions'

const ARWEAVE_CDN_HOST = process.env.NEXT_PUBLIC_ARWEAVE_CDN_HOST as string

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
  margin: 0 0 ${sv.appPadding}px 0;
  padding: ${sv.grid}px;
  display: ${props => props.flex ? 'flex' : 'block'};
`;

const Words = styled.div`
  flex: 1;
  margin-right: ${sv.appPadding}px;
  margin-bottom: ${sv.grid * 2}px;
`;

const Store = styled.a`
  ${sv.flexCenter};
  flex-direction: column;
  transition: all .2s ease;
  padding: ${sv.grid * 2}px;
  ${sv.borderRadius};
  margin: ${sv.grid}px;
  background-color: white;
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

const StoreName = styled(Text)`
  width: 100%;
  ${sv.label};
  text-align: center;
  margin-top: ${sv.grid}px;
`;

const StoreImage = styled.img`
  width: 75px;
  height: 75px;
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
            <List
              grid={{ xs: 1, sm: 2, md: 4, lg: 4, xl: 4, xxl: 4, gutter: 16 }}
              dataSource={storefronts}
              pagination={{
                pageSize: 20,
                total: storefronts.length,
              }}
              renderItem={(item: Storefront) => (
                <List.Item key={item.subdomain}>
                  <Store
                    href={`https://${item?.subdomain}.holaplex.com`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Image preview={false} src={replace('https://arweave.net:443', ARWEAVE_CDN_HOST, item?.theme.logo.url)} alt="" width={75} height={75} />
                    <StoreName ellipsis>
                      {item?.meta.title}
                    </StoreName>
                  </Store>
                </List.Item>
              )}
            />
          </>
        </Loading>
      </Col>
    </Container>

  )
};

export default StoreFronts;

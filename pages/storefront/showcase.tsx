import { useEffect, useState } from 'react'
import { Grid } from 'antd-mobile';
import ArweaveSDK from '@/modules/arweave/client'
import { initArweave } from '@/modules/arweave'

export default () => {
  const [storefronts, setStorefronts] = useState([])
  useEffect(() => {
    const arweave = initArweave()
    ArweaveSDK.using(arweave).storefront.list()
      .then(storefrontData => {
        const storefronts = storefrontData.map(st => st.storefront)
        setStorefronts(storefronts)
        // setStorefronts(storefronts
      })

  }, [])

  console.log(storefronts[0])
  return (
    <div>
      
      <Grid 
        itemStyle={{ display: 'inline-block' }}
        data={storefronts}
        columnNum={5}
        renderItem={storefront => {
          return (
            <div style={{ padding: '12.5px' }}>
              <img src={storefront?.theme?.logo?.url} style={{ width: '75px', height: '75px' }} alt="" />
              <div style={{ color: '#fff', fontSize: '14px', marginTop: '12px' }}>
                <span>{storefront?.meta?.title}</span>
              </div>
            </div>

          )
        }}
      />
    </div>

  )
};
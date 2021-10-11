import ArweaveSDK from '@/modules/arweave/client'
import { initArweave } from '@/modules/arweave'
import { stylesheetV2 } from '@/modules/theme'

function main() {

  const arweave = initArweave()

  ArweaveSDK.using(arweave).storefront.list()
  .then(data => {
    const storefronts = data.map(st => st.storefront)
    storefronts.forEach( async (storefront) => {
      const css = stylesheetV2(storefront.theme)
      ArweaveSDK.using(arweave).storefront.upsert(
        storefront,
        css,
        '2'
      )
    })
  })
}
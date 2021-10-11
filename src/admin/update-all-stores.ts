import ArweaveSDK from '@/modules/arweave/client'
import { initArweave } from '@/modules/arweave'
import { stylesheetV2 } from '@/modules/theme'

export default function() {

  const arweave = initArweave();
  const version = '2;'

  ArweaveSDK.using(arweave).storefront.list()
    .then(data => {
      const storefronts = data.map(st => st.storefront)
      storefronts.forEach((storefront) => {
        if (storefront.theme.version == version) { return; }
        
        const css = stylesheetV2(storefront.theme)
        ArweaveSDK.using(arweave).storefront.upsert(
          storefront,
          css,
          version
        )
        .then(storefront => console.log(`updated ${storefront.subdomain} to v${version}`))
        .catch(error => console.log(`error updating storefront ${storefront} to v${version}`))
      })
  })
}
import { initArweave } from '../src/modules/arweave'
import arweaveSDK from '../src/modules/arweave/client'
import { isNil } from 'ramda'

const args = process.argv.slice(2)

async function main(pubkey: string) {
  const arweave = initArweave()
  const storefront = await arweaveSDK.using(arweave).storefront.find("solana:pubkey", pubkey)

  if (isNil(storefront)) {
    throw new Error("storefront does not exist")
  }

  console.log(JSON.stringify(storefront))
}

main(args[0])
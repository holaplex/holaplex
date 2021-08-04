import { initArweave } from '../src/modules/arweave'
import arweaveSDK from '../src/modules/arweave/client'
import fs from 'fs'
import {variables} from './../src/modules/theme'
import { isNil } from 'ramda'

const args = process.argv.slice(2)
const pubkey = args[0]

async function main() {
  const arweave = initArweave()
  const storefront = await arweaveSDK.using(arweave).storefront.find("solana:pubkey", pubkey)

  if (isNil(storefront)) {
    throw new Error("storefront does not exist")
  }

  const css = variables(storefront.theme)

  fs.writeFile('ant-theme.less', css, function (err) {
    if (err) throw err;
  });
}

main()
import fs from 'fs'
import { stylesheet } from '../src/modules/theme'
import { isEmpty } from 'ramda'

const args = process.argv.slice(2)
const pubkey = args[0]

async function main(manifest: string) {
  console.log(manifest)
  if (isEmpty(manifest)) {
    throw new Error("No storefront manifest")
  }
  const storefront = JSON.parse(manifest)

  const less = stylesheet(storefront.theme)

  fs.writeFile('./overrides.less', less, function (err) {
    if (err) throw err;
  });
}

main(args[0])
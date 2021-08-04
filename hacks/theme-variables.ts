import fs from 'fs'
import { variables } from './../src/modules/theme'
import { isEmpty } from 'ramda'

const args = process.argv.slice(2)
const pubkey = args[0]

async function main(manifest: string) {
  if (isEmpty(manifest)) {
    throw new Error("No storefront manifest")
  }
  const storefront = JSON.parse(manifest)

  const css = variables(storefront.theme)

  fs.writeFile('ant-theme-overrides.less', css, function (err) {
    if (err) throw err;
  });
}

main(args[0])
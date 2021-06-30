import SparkMD5 from 'spark-md5'
import { curry } from 'ramda';
import { upload } from './../../services/bucket'
import { Storefront, StorefrontTheme } from './../../types'
import { stylesheet } from './../theme'

const uploadStysheet = curry(upload)("opus-logica-holaplex-storefronts", "text/css")

export async function style({ subdomain, pubkey }: Storefront, theme: StorefrontTheme): Promise<string> {
    const blob = stylesheet(theme)

    const hash = SparkMD5.hash(blob)
    const location = `${pubkey}/overrides-${hash}.css`

    await uploadStysheet(location, blob)

    return `https://${subdomain}.holaplex.com/${location}`
}
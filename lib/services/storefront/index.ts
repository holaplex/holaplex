import { Storefront, StorefrontTheme } from './../../types'
import { stylesheet } from './../theme'
// @ts-ignore
import SparkMD5 from 'spark-md5'
import { upload } from './../../services/bucket'


export async function style({ subdomain, pubkey }: Storefront, theme: StorefrontTheme) {
    const blob = stylesheet(theme)

    const hash = SparkMD5.hash(blob)
    const location = `${pubkey}/overrides-${hash}.css`
    const bucketName = 'opus-logica-holaplex-storefronts'

    await upload(bucketName, location, blob)

    return `https://${subdomain}.holaplex.com/${location}`
}
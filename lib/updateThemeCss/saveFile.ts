// no types for this lib
// @ts-ignore
import SparkMD5 from 'spark-md5'
import prisma from '../prisma';
const Minio = require('minio')
import { Readable } from 'stream'


export default async function saveFile(
  cssContent: string,
  subdomain: string,
  pubkey: string
  ) {
  const minioClient = new Minio.Client({
      endPoint: 's3.amazonaws.com',
      accessKey: process.env.AWS_ACCESS_KEY,
      secretKey: process.env.AWS_SECRET_KEY
  });



  const hash = SparkMD5.hash(cssContent)
  const location = `${pubkey}/overrides-${hash}.css`
  const bucketName = 'opus-logica-holaplex-storefronts'
  const themeUrl = `https://${location}`

  const fs = new Readable()
  fs.push(cssContent)
  fs.push(null)     
  
  return minioClient.putObject(bucketName, location, fs, async function(err: Error) {
    if(err) {
      return console.log(err)
    }
    
    await prisma.storefront.update({
      where: { subdomain: subdomain },
      data: { themeUrl }
    })
  })


}

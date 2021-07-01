// @ts-nocheck
import crypto from 'crypto'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Storefront } from '@/modules/storefront/types'
import { cors } from  '@/modules/middleware'
import formidable from 'formidable'
import { upload } from '@/modules/bucket'
import fs from 'fs-extra'


export const config = {
  api: {
    bodyParser: false
  },
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Storefront>
) {
  await cors(req, res)

  const form = new formidable.IncomingForm();

  try {
    form.parse(req, async (err, fields, files) => {
      const ext = files.logo.name.match(/\.[^.]*$/)[0]
      
      const logoPath = `${fields.subdomain}/logo-${makeSha(files.logo.name)}${ext}`
      const data = fs.readFileSync(files.logo.path);

      await upload(
        "opus-logica-holaplex-storefronts",
        files.logo.type,
        logoPath,
        data
      )
      res.status(200).send({ logoPath })
    })
  } catch(error) {
    throw error
  }

}

function makeSha(file) {
  const hash = crypto.createHash('sha1');
  hash.setEncoding('hex');
  hash.write(file);
  hash.end();
  
  const sha1sum = hash.read()
  return sha1sum;
}
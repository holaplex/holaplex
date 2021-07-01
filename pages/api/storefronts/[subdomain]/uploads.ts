// @ts-nocheck
import crypto from 'crypto'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Storefront } from '@/modules/storefront/types'
import { cors } from  '@/modules/middleware'
import formidable from 'formidable'
import { upload } from '@/modules/bucket'
import { parse } from '@/modules/upload'
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

  const subdomain = req.query.subdomain as string

  switch (req.method) {
    case 'POST': {  
      try {
        const files = await parse(req)

        const ext = files.file.name.match(/\.[^.]*$/)[0]
        const path = `${subdomain}/${makeSha(files.file.name)}${ext}`
        const data = fs.readFileSync(files.file.path);
      
        await upload(
          "opus-logica-holaplex-storefronts",
          files.file.type,
          path,
          data
        )

        const url = `https://${subdomain}.holaplex.com/${path}`

        return res.status(200).json({ url })
      } catch(error) {
        return res.status(500).end(error)
      }
    }
    default: {
      res.setHeader('Allow', ['POST'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
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
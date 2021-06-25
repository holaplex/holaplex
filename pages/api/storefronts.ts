// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { ApiError } from 'next/dist/next-server/server/api-utils'
import prisma from  '../../lib/prisma'
import { Storefront } from '../../lib/types'
import { cors } from  '../../lib/middleware'



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Storefront>
) {
  await cors(req, res)

  switch (req.method) {
    case 'POST': {
      if (req.method === 'POST') {
        const existingSubdomain = await prisma.storefront.findFirst({ where: { subdomain: req.body.subdomain }})
        const existingPubKey = await prisma.storefront.findFirst({ where: { pubkey: req.body.pubkey }})

        if (existingPubKey) {
          throw new ApiError(422, "storefront with this pubkey already exists")
        }
        if (existingSubdomain) {
          throw new ApiError(422, "storefront with this subdomain already exists")
        }

        try {
          const storefront = await prisma.storefront.create({ data: { pubkey: req.body.pubkey, subdomain: req.body.subdomain, theme: {} }})

          if (storefront) {
            res.status(201).json(storefront)
          }

        } catch(error) {
          throw new ApiError(500, `storefront creation error ${error}`)
        }
      }
    }
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }


}

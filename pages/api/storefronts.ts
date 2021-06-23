// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Prisma } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { ApiError } from 'next/dist/next-server/server/api-utils'
import prisma from  '../../lib/prisma'


type Storefront = {
  id: number,
  theme: Prisma.JsonValue,
  subdomain: string,
  pubkey: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Storefront>
) {
  if (req.method === 'POST') {
    
    const existingSubdomain = await prisma.storefront.findFirst({ where: { subdomain: req.body.subdomain }})
    const existingPubKey = await prisma.storefront.findFirst({ where: { pubkey: req.body.pubkey }})

    if (existingPubKey) {
      return new ApiError(422, "storefront with this pubkey already exists")
    }
    if (existingSubdomain) {
      return new ApiError(422, "storefront with this subdomain already exists")
    }

    try {
      const storefront = await prisma.storefront.create({ data: { pubkey: req.body.pubkey, subdomain: req.body.subdomain, theme: {} }})

      if (storefront) {
        return res.status(201).json(storefront)
      }

    } catch(error) {
      return new ApiError(500, `storefront creation error ${error}`)
    }
  }
}

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
  if (req.method === 'GET') {
    const storefront = await prisma.storefront.findFirst({ where: {
      subdomain: req.query.subdomain as string,
      pubkey: req.query.pubkey as string,
    }})
    if (storefront) {
      return res.status(200).json(storefront)
    }
 
  }
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
        return res.status(201).json(storefront)
      }

    } catch(error) {
      throw new ApiError(500, `storefront creation error ${error}`)
    }
  }

  if (req.method === 'PATCH') {
    const storefront = await prisma.storefront.findFirst({ where: {
      subdomain: req.body.subdomain,
      pubkey: req.body.pubkey,
    }})

    try {
      if (storefront) {
        const updatedStorefront = await prisma.storefront.update({
          where: { id: storefront.id },
          data: { theme: req.body.theme }
        })
        if (updatedStorefront) {
          return res.status(204).json({ ...updatedStorefront })
        }
      }
    } catch(error) {
      throw new ApiError(500, `error updating storefront ${error}`)
    }
  }
}

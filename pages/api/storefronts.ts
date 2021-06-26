// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { ApiError } from 'next/dist/next-server/server/api-utils'
import prisma from  '../../lib/prisma'
import { Storefront, StorefrontTheme } from '../../lib/types'
import { cors } from  '../../lib/middleware'
import { style } from '../../lib/services/storefront'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Storefront>
) {
  await cors(req, res)

  switch (req.method) {
    case 'POST': {
      const existingSubdomain = await prisma.storefront.findFirst({ where: { subdomain: req.body.subdomain }})
      const existingPubKey = await prisma.storefront.findFirst({ where: { pubkey: req.body.pubkey }})

      if (existingPubKey) {
        throw new ApiError(422, "storefront with this pubkey already exists")
      }
      if (existingSubdomain) {
        throw new ApiError(422, "storefront with this subdomain already exists")
      }

      try {
        const storefrontParams = req.body as Storefront

        const themeUrl = await style(
          storefrontParams,
          storefrontParams.theme
        )

        const storefront = await prisma.storefront.create({ 
          data: { ...storefrontParams, themeUrl } as Storefront,
        }) as Storefront

        return res.status(201).json(storefront)
      } catch(error) {
        throw new ApiError(500, `storefront creation error ${error}`)
      }
    }
    default:
      res.setHeader('Allow', ['POST'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

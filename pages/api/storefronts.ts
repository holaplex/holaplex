// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { ApiError } from 'next/dist/next-server/server/api-utils'
import prisma from  '../../lib/prisma'
import { Storefront, StorefrontTheme } from '../../lib/types'
import { cors } from  '../../lib/middleware'
import { style } from '../../lib/services/storefront'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Storefront | object>
) {
  await cors(req, res)

  switch (req.method) {
    case 'GET': {
      const storefront = await prisma.storefront.findUnique({
        where: {
          subdomain: req.query.subdomain as string,
        }
      }) as Storefront

    
      if (!storefront) {
        res.status(404).send({})
        return;
      }
      res.status(200).json(storefront)
      return;
    }
    case 'POST': {
      const existingSubdomain = await prisma.storefront.findFirst({ where: { subdomain: req.body.subdomain }})
      if (existingSubdomain) {
        throw new ApiError(422, "storefront with this subdomain already exists")
      }
     
      try {
        const storefrontParams = req.body as Storefront

        const newStoreFront = storefrontParams

        if (storefrontParams.theme) {
          const themeUrl = await style(
            storefrontParams,
            storefrontParams.theme
          )
          newStoreFront.themeUrl = themeUrl

        }

        let storefront;
        try {
          storefront = await prisma.storefront.create({ 
            data: { ...newStoreFront } as Storefront,
          }) as Storefront

        } catch(error) {
          throw new ApiError(500, `storefront creation error ${error}`)
        }

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

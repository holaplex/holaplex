import type { NextApiRequest, NextApiResponse } from 'next'
import { ApiError } from 'next/dist/next-server/server/api-utils'
import { Storefront, StorefrontTheme } from '../../../lib/types'
import prisma from  '../../../lib/prisma'
import { cors } from  '../../../lib/middleware'
import updateThemeCss from '../../../lib/updateThemeCss'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Storefront>
) {
  await cors(req, res)

  switch (req.method) {
    case 'GET': {
      const storefront = await prisma.storefront.findUnique({
        where: {
          subdomain: req.query.subdomain as string,
        }
      })

      if (storefront) {
        res.status(200).json(storefront)
      } else {
        res.status(404)
      }
    }
    case 'PATCH': {
      try {
        const updatedStorefront = await prisma.storefront.update({
          where: { subdomain: req.query.subdomain as string },
          data: { theme: req.body.theme }
        })


        try {
          await updateThemeCss(
            updatedStorefront.theme as StorefrontTheme,
            updatedStorefront.subdomain,
            updatedStorefront.pubkey
          )
        } catch(error) {
          throw new ApiError(500, `error updating storefront ${error}`)
        }

        return res.status(204).json(updatedStorefront)
      } catch(error) {
        throw new ApiError(500, `error updating storefront ${error}`)
      }
    }
    default:
      res.setHeader('Allow', ['GET', 'PATCH'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

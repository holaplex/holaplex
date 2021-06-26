import type { NextApiRequest, NextApiResponse } from 'next'
import { ApiError } from 'next/dist/next-server/server/api-utils'
import { Storefront, StorefrontTheme } from '../../../lib/types'
import prisma from  '../../../lib/prisma'
import { cors } from  '../../../lib/middleware'
import { style } from '../../../lib/services/storefront'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Storefront>
) {
  await cors(req, res)

  const storefront = await prisma.storefront.findUnique({
    where: {
      subdomain: req.query.subdomain as string,
    }
  }) as Storefront

  if (!storefront) {
    res.status(404)
    return
  }

  switch (req.method) {
    case 'GET': {
      return res.status(200).json(storefront)
    }
    case 'PATCH': {
      try {
          const theme = req.body.theme as StorefrontTheme

          const themeUrl = await style(
            storefront,
            theme
          )

          const updatedStorefront = await prisma.storefront.update({
            where: { subdomain: storefront.subdomain },
            data: { theme, themeUrl } as Storefront
          }) as Storefront

        return res.status(204).json(updatedStorefront)
      } catch(error) {
        throw new ApiError(500, `error updating storefront ${error}`)
      }
    }
    default:
      res.setHeader('Allow', ['GET', 'PATCH'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

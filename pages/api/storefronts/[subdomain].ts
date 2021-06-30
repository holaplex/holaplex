import type { NextApiRequest, NextApiResponse } from 'next'
import { pick } from 'ramda'
import { Prisma } from '@prisma/client'
import { Storefront } from '../../../lib/types'
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
    return res.status(404).end()
  }

  switch (req.method) {
    case 'GET': {
      return res.status(200).json(storefront)
    }
    case 'PATCH': {
      try {
          const storefrontParams = { ...{ theme: {} }, ...storefront, ...req.body } as Storefront

          const themeUrl = await style(
            storefront,
            storefrontParams.theme
          )

          const updatedStorefront = await prisma.storefront.update({
            where: { subdomain: storefront.subdomain },
            data: {
              ...storefrontParams,
              themeUrl
            }
          }) as Storefront

        return res.status(200).json(updatedStorefront)
      } catch(error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          return res.status(409).end(error.message)
        } else {
          return res.status(500).end()
        }
      }
    }
    default:
      res.setHeader('Allow', ['GET', 'PATCH'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

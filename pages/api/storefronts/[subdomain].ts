import type { NextApiRequest, NextApiResponse } from 'next'
import { Prisma } from '@prisma/client'
import { Storefront } from '@/modules/storefront/types'
import prisma from  '@/modules/db'
import { cors } from  '@/modules/middleware'
import { style } from '@/modules/storefront'

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
          console.log(storefrontParams);

          const themeUrl = await style(
            storefront,
            storefrontParams.theme
          )
          console.log(themeUrl);

          const updatedStorefront = await prisma.storefront.update({
            where: { subdomain: storefront.subdomain },
            data: {
              ...storefrontParams,
              themeUrl
            }
          }) as Storefront
          console.log(JSON.stringify(updatedStorefront));

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

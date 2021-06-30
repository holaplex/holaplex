// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from  '../../lib/prisma'
import { Prisma } from '@prisma/client'
import { Storefront } from '../../lib/types'
import { cors } from  '../../lib/middleware'
import { style } from '../../lib/services/storefront'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Storefront | object>
) {
  await cors(req, res)

  switch (req.method) {
    case 'POST': {
      try {
        const storefrontParams = req.body as Storefront

        const themeUrl = await style(
          storefrontParams,
          storefrontParams.theme
        )
       
        const storefront = await prisma.storefront.create({ 
          data: { ...storefrontParams, themeUrl },
        }) as Storefront

        return res.status(201).json(storefront)
      } catch(error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          return res.status(422).end(error.message)
        } else {
          return res.status(500).end()
        }
      }
    }
    default:
      res.setHeader('Allow', ['POST'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

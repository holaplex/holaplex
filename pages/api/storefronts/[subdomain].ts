import type { NextApiRequest, NextApiResponse } from 'next'
import { ApiError } from 'next/dist/next-server/server/api-utils'
import { Storefront } from '../../../lib/types'
import prisma from  '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Storefront>
) {

  if (req.method === 'PUT') {
      
    try {
      const updatedStorefront = await prisma.storefront.update({
        where: { subdomain: req.query.subdomain as string },
        data: { theme: req.body.theme }
      })
      if (updatedStorefront) {
        return res.status(204).json(req.body.theme)
      }
    } catch(error) {
      throw new ApiError(500, `error updating storefront ${error}`)
    }
  }
}
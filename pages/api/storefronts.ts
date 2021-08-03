import type { NextApiRequest, NextApiResponse } from 'next'
import type { Storefront } from '@/modules/storefront/types'
import ArweaveSDK from '@/modules/arweave/client'
import { initArweave } from '@/modules/arweave'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Storefront[] | object>
) {
  switch (req.method) {
    case 'GET': {
      try {
        const arweave = initArweave()
        const storefronts = await ArweaveSDK.using(arweave).storefront.list()

        return res.status(200).json(storefronts)
      } catch (e) {
        console.error(e)
        return res.status(500).end()
      }
    }
    default:
      res.setHeader('Allow', ['GET'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

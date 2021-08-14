import type { NextApiRequest, NextApiResponse } from 'next'
import { CircleCISDK } from '@/modules/circleci'
import prisma from  '@/modules/db'
import { Prisma } from '@prisma/client'
import { initArweave } from '@/modules/arweave'
import type { Pipeline } from '@/modules/pipelines'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Pipeline>
) {
  switch (req.method) {
    case 'POST': {
      try {
        const arweaveId = req.body.arweaveId as string
        const arweave = initArweave()

        const storefront = await arweave.transactions.getData(arweaveId, { decode: true, string: true }) as string
  
        const pipeline = await CircleCISDK.pipelines.deployMetaplex({ storefront })

        const data = {
          arweaveId,
          runId: pipeline.id
        }

        const pipelineRun = await prisma.pipelineRuns.create({
          data
        })
  
        return res.status(200).json(pipelineRun) 
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          return res.status(422).end(error.message)
        } else {
          return res.status(500).end(error.message)
        }
      }
    }
    default:
      res.setHeader('Allow', ['POST'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
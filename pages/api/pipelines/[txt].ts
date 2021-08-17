import type { NextApiRequest, NextApiResponse } from 'next'
import { CircleCISDK } from '@/modules/circleci'
import prisma from  '@/modules/db'
import type { Pipeline } from '@/modules/pipelines'
import { Prisma } from '@prisma/client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Pipeline>
) {
  const pipelineRun = await prisma.pipelineRuns.findUnique({
    where: {
      arweaveId: req.query.txt as string,
    }
  })

  if (!pipelineRun) {
    return res.status(404).end()
  }

  const workflow = await CircleCISDK.pipelines.workflow(pipelineRun.runId)

  switch (req.method) {
    case 'GET': {
      return res.status(200).json({ ...pipelineRun, workflow })
    }
    default:
      res.setHeader('Allow', ['GET'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
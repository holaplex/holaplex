import type { NextApiRequest, NextApiResponse } from 'next'
import { Octokit } from '@octokit/core'
import { initArweave } from '@/modules/arweave'
import type { Pipeline } from '@/modules/pipelines'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Pipeline>
) {
  switch (req.method) {
    case 'POST': {
      const octokit = new Octokit({ auth: process.env.GITHUB_ACCESS_TOKEN });
      const arweave = initArweave()

      const storefront = await arweave.transactions.getData(req.body.arweaveId, { decode: true, string: true })

      await octokit.request('POST /repos/holaplex/{repo}/actions/workflows/{workflow_id}/dispatches', {
        owner: 'holaplex',
        repo: 'holaplex-builder',
        workflow_id: 'launch-ipfs.yml',
        ref: 'ipfs-hosted-storefronts',
        inputs: {
          storefront
        }
      })      

      return res.status(200).json({})
    }
    default:
      res.setHeader('Allow', ['POST'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
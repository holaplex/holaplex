import fetch from 'isomorphic-unfetch'

const CIRCLECI_TOKEN = process.env.CIRCLECI_TOKEN as string

export enum WorflowStatus {
  Success = "success",
  Running = "running",
  Canceled = "canceled",
  Failed = "failed",
}

export type WorkflowResponse = {
  status: WorflowStatus;
}

export type PipelineResponse = {
  id: string;
  status: string;
  workflows: WorkflowResponse[];
  created_at: string;
}

export type PipelineParams = {
  storefront: string;
}

export const CircleCISDK = {
  pipelines: {
    lookup: async (id: string): Promise<PipelineResponse> => {
      const response = await fetch(
        `https://circleci.com/api/v2/pipeline/${id}`,
        {
          headers: {
            'Circle-Token': CIRCLECI_TOKEN,
            'Content-Type': 'application/json',
          },
        }
      )

      const json = await response.json()

      return json
    },
    workflow: async (id: string): Promise<WorkflowResponse[]> => {
      const response = await fetch(
        `https://circleci.com/api/v2/pipeline/${id}/workflow`,
        {
          headers: {
            'Circle-Token': CIRCLECI_TOKEN,
            'Content-Type': 'application/json',
          },
        }
      )

      const { items } = await response.json()

      return items[0]
    },
    deployMetaplex: async ({ storefront }: PipelineParams):Promise<PipelineResponse> => {
      const response = await fetch(
        'https://circleci.com/api/v2/project/gh/holaplex/holaplex-builder/pipeline',
        {
          method: 'POST',
          headers: {
            'Circle-Token': CIRCLECI_TOKEN,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            branch: "ipfs-hosted-storefronts",
            parameters: {
              storefront,
              run_deploy_metaplex: true,
            }
          })
        }
      )

      const json = await response.json()

      return json
    },
  }
}

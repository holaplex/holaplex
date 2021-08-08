import fetch from 'isomorphic-unfetch'

export const PipelineSDK = {
  async start(arweaveId: string) {
    const response = await fetch('/api/pipelines', { method: 'POST', body: JSON.stringify({ arweaveId }) })

    const pipeline = response.json()

    return pipeline
  }
}
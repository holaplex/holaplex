import fetch from 'isomorphic-unfetch'
import type { Pipeline } from './types'

export const PipelineSDK = {
  async start(arweaveId: string): Promise<Pipeline> {
    const response = await fetch(
      '/api/pipelines',
      { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ arweaveId })
      })

    const pipeline = response.json()

    return pipeline
  },
  async get(arweaveId: string): Promise<Pipeline> {
    const response = await fetch(
      `/api/pipelines/${arweaveId}`,
      { 
        headers: {
          'Content-Type': 'application/json'
        },
      })

    const pipeline = response.json()

    return pipeline
  }
}
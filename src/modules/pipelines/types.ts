import type { WorkflowResponse } from '@/modules/circleci'

export type Pipeline = {
  workflow: WorkflowResponse;
  arweaveId: string;
  runId: string;
}
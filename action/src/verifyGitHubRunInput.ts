export interface VerifyGitHubRunInput {
  githubToken: string
  owner: string
  repo: string
  runtimeUrl: string
  runtimeToken: string
  workFlowRunId: string
}

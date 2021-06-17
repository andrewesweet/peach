import * as core from '@actions/core'
import {
  getRuntimeToken,
  getRuntimeUrl,
  getWorkFlowRunId
} from '@actions/artifact/lib/internal/config-variables'
import fetch from 'node-fetch'
import {VerifyGitHubRunResult} from './verifyGitHubRunResult'
import {VerifyGitHubRunInput} from './verifyGitHubRunInput'

async function run(): Promise<void> {
  try {
    const input = core.getInput('function_uri')
    core.info(`function_uri: ${input}`)

    const githubToken = core.getInput('github_token')

    if (process.env['GITHUB_REPOSITORY'] === undefined) {
      core.setFailed('Environment variable GITHUB_REPOSITORY was not set')
      return
    }
    const githubRepository = process.env['GITHUB_REPOSITORY'].split('/')

    const result = await verifyGitHubRun(
      input,
      githubToken,
      githubRepository[0],
      githubRepository[1],
      getRuntimeUrl(),
      getRuntimeToken(),
      getWorkFlowRunId()
    )

    core.setOutput('message', result.message)
  } catch (error) {
    core.setFailed(error.message)
  }
}

async function verifyGitHubRun(
  functionUri: string,
  githubToken: string,
  owner: string,
  repo: string,
  runtimeUrl: string,
  runtimeToken: string,
  workFlowRunId: string
): Promise<VerifyGitHubRunResult> {
  const requestBody: VerifyGitHubRunInput = {
    githubToken,
    owner,
    repo,
    runtimeUrl,
    runtimeToken,
    workFlowRunId
  }
  // eslint-disable-next-line no-console
  console.debug(`Sending body: ${requestBody}`)

  const response = await fetch(functionUri, {
    method: 'POST',
    body: JSON.stringify(requestBody),
    headers: {'Content-Type': 'application/json'}
  })
  const responseBody = await response.json()
  return responseBody as VerifyGitHubRunResult
}

run()

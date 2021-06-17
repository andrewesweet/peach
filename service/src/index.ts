import express from 'express'
import {VerifyGitHubRunInput} from './verifyGitHubRunInput'
import {create} from '@actions/artifact'
import * as fs from 'fs'
import {v4 as uuidv4} from 'uuid'
import path from 'path'
import bodyParser from 'body-parser'
import {VerifyGitHubRunResult} from './verifyGitHubRunResult'
import morgan from 'morgan'
import {Octokit} from '@octokit/rest'

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
async function verify(
  req: express.Request<{}, {}, VerifyGitHubRunInput>,
  res: express.Response<VerifyGitHubRunResult, {}>
): Promise<void> {
  // eslint-disable-next-line no-console
  console.log(`Request: ${JSON.stringify(req.body)}`)
  process.env['ACTIONS_RUNTIME_URL'] = req.body.runtimeUrl
  process.env['ACTIONS_RUNTIME_TOKEN'] = req.body.runtimeToken
  process.env['GITHUB_RUN_ID'] = req.body.workFlowRunId

  const tempFileName = `${uuidv4()}.txt`
  // eslint-disable-next-line no-console
  console.debug(`Temp file name: ${tempFileName}`)
  const tempRootDir = '/tmp'
  // eslint-disable-next-line no-console
  console.debug(`Temp root dir: ${tempRootDir}`)
  const tempFilePath = path.join(tempRootDir, tempFileName)
  // eslint-disable-next-line no-console
  console.debug(`Temp file path: ${tempFilePath}`)
  fs.writeFileSync(tempFilePath, 'test')

  try {
    const artifactClient = create()
    const result = await artifactClient.uploadArtifact(
      `Verification-${tempFileName}`,
      [tempFilePath],
      tempRootDir
    )

    if (result.failedItems.length !== 0) {
      res.status(404).send({message: "It's a FAAAAAAAAKE"})
      return
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(`Unexpected error: ${e}`)
    res.status(404).send({message: "It's a FAAAAAAAAKE"})
  } finally {
    fs.unlinkSync(tempFilePath)
  }

  const octokit = new Octokit({
    auth: req.body.githubToken
  })

  const runResponse = await octokit.actions.getWorkflowRun({
    owner: req.body.owner,
    repo: req.body.repo,
    run_id: parseInt(req.body.workFlowRunId)
  })

  res.send({message: `Good luck building ${runResponse.data.head_branch}`})
}

app.get('/', async (req, res) => {
  // eslint-disable-next-line no-console
  console.log(`GET`)
  await verify(req, res)
})

app.post('/', async (req, res) => {
  // eslint-disable-next-line no-console
  console.log(`POST`)
  await verify(req, res)
})

const port = process.env.PORT || 8080
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Peach listening on port ${port}`)
})

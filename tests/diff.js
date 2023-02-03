import 'should'
import { readFileSync } from 'fs'
import { promisify } from 'util'
import { exec as _exec } from 'node:child_process'

const exec = promisify(_exec)

const sampleSyncTransformerDiff = readFileSync('./tests/assets/sample.sync_transformer.diff').toString()
const sampleAsyncTransformerDiff = readFileSync('./tests/assets/sample.async_transformer.diff').toString()

describe('diff', () => {
  it('should output a diff for a sync function', async () => {
    const { stdout } = await exec('./bin/ndjson-apply.js --diff ./tests/assets/sync_transformer.js < ./tests/assets/sample.ndjson')
    stdout.should.equal(sampleSyncTransformerDiff)
  })

  it('should output a diff for an async function', async () => {
    const { stdout } = await exec('./bin/ndjson-apply.js --diff ./tests/assets/async_transformer.js < ./tests/assets/sample.ndjson')
    stdout.should.equal(sampleAsyncTransformerDiff)
  })
})

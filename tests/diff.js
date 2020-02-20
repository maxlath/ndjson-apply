require('should')
const { promisify } = require('util')
const exec = promisify(require('child_process').exec)
const shouldntGetHere = () => { throw new Error("shouldn't get here") }
const { readFileSync } = require('fs')
const sampleSyncTransformerDiff = readFileSync('./tests/assets/sample.sync_transformer.diff').toString()
const sampleAsyncTransformerDiff = readFileSync('./tests/assets/sample.async_transformer.diff').toString()

describe('diff', () => {
  it('should output a diff for a sync function', async () => {
    const { stdout, stderr } = await exec('./bin/ndjson-apply --diff ./tests/assets/sync_transformer.js < ./tests/assets/sample.ndjson')
    stdout.should.equal(sampleSyncTransformerDiff)
  })

  it('should output a diff for an async function', async () => {
    const { stdout, stderr } = await exec('./bin/ndjson-apply --diff ./tests/assets/async_transformer.js < ./tests/assets/sample.ndjson')
    stdout.should.equal(sampleAsyncTransformerDiff)
  })
})

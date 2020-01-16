require('should')
const { promisify } = require('util')
const exec = promisify(require('child_process').exec)
const shouldntGetHere = () => { throw new Error("shouldn't get here") }

describe('ndjson-apply', () => {
  it('should reject an invalid function module', async () => {
    try {
      const { stdout, stderr } = await exec('./cli.js')
      shouldntGetHere()
    } catch (err) {
      err.message.should.startWith('Command failed')
    }
  })

  it('should accept a sync function', async () => {
    const { stdout, stderr } = await exec('./cli.js ./tests/sync_transformer.js < ./tests/sample.ndjson')
    const data = stdout.trim().split('\n').map(line => JSON.parse(line))
    data.should.deepEqual([
      { a: 123, b: 456, total: 579 },
      { a: 789, b: 123, total: 912 }
    ])
  })

  it('should accept an async function', async () => {
    const { stdout, stderr } = await exec('./cli.js ./tests/async_transformer.js < ./tests/sample.ndjson')
    const data = stdout.trim().split('\n').map(line => JSON.parse(line))
    data.should.deepEqual([
      { a: 123, b: 456, total: 679 },
      { a: 789, b: 123, total: 1012 }
    ])
  })
})

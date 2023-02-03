import 'should'
import { promisify } from 'node:util'
import { exec as _exec } from 'node:child_process'

const exec = promisify(_exec)

const shouldntGetHere = () => { throw new Error("shouldn't get here") }

describe('apply', () => {
  it('should reject an invalid function module', async () => {
    try {
      await exec('./bin/ndjson-apply')
      shouldntGetHere()
    } catch (err) {
      err.message.should.startWith('Command failed')
    }
  })

  it('should accept a sync function', async () => {
    const { stdout } = await exec('./bin/ndjson-apply.js ./tests/assets/sync_transformer.js < ./tests/assets/sample.ndjson')
    const data = stdout.trim().split('\n').map(line => JSON.parse(line))
    data.should.deepEqual([
      { a: 123, b: 456, total: 579 },
      { a: 789, b: 123, total: 912 },
    ])
  })

  it('should accept an async function', async () => {
    const { stdout } = await exec('./bin/ndjson-apply.js ./tests/assets/async_transformer.js < ./tests/assets/sample.ndjson')
    const data = stdout.trim().split('\n').map(line => JSON.parse(line))
    data.should.deepEqual([
      { a: 123, b: 456, total: 679 },
      { a: 789, b: 123, total: 1012 },
    ])
  })

  it('should filter-out lines returning empty', async () => {
    const { stdout } = await exec('./bin/ndjson-apply.js ./tests/assets/even_only_transformer.js < ./tests/assets/sample.ndjson')
    const data = stdout.trim().split('\n').map(line => JSON.parse(line))
    data.should.deepEqual([
      { a: 789, b: 123, total: 912 },
    ])
  })

  it('should use additional argument to find sub function', async () => {
    const { stdout } = await exec('./bin/ndjson-apply.js ./tests/assets/function_collection.js multiply < ./tests/assets/sample.ndjson')
    const data = stdout.trim().split('\n').map(line => JSON.parse(line))
    data.should.deepEqual([
      { a: 123, b: 456, total: 56088 },
      { a: 789, b: 123, total: 97047 },
    ])
  })

  it('should pass remaining arguments to function', async () => {
    const { stdout } = await exec('./bin/ndjson-apply.js ./tests/assets/sync_transformer.js 100 < ./tests/assets/sample.ndjson')
    const data = stdout.trim().split('\n').map(line => JSON.parse(line))
    data.should.deepEqual([
      { a: 123, b: 456, total: 679 },
      { a: 789, b: 123, total: 1012 },
    ])
  })

  it('should pass remaining arguments to sub function', async () => {
    const { stdout } = await exec('./bin/ndjson-apply.js ./tests/assets/function_collection.js multiply 10 < ./tests/assets/sample.ndjson')
    const data = stdout.trim().split('\n').map(line => JSON.parse(line))
    data.should.deepEqual([
      { a: 123, b: 456, total: 560880 },
      { a: 789, b: 123, total: 970470 },
    ])
  })

  it('should pass remaining arguments to async function', async () => {
    const { stdout } = await exec('./bin/ndjson-apply.js ./tests/assets/async_transformer.js 20 < ./tests/assets/sample.ndjson')
    const data = stdout.trim().split('\n').map(line => JSON.parse(line))
    data.should.deepEqual([
      { a: 123, b: 456, total: 699 },
      { a: 789, b: 123, total: 1032 },
    ])
  })

  it('should pass remaining arguments to async sub function', async () => {
    const { stdout } = await exec('./bin/ndjson-apply.js ./tests/assets/function_collection.js multiplyAsync 1000 < ./tests/assets/sample.ndjson')
    const data = stdout.trim().split('\n').map(line => JSON.parse(line))
    data.should.deepEqual([
      { a: 123, b: 456, total: 56088000 },
      { a: 789, b: 123, total: 97047000 },
    ])
  })

  it('should accept a sync function', async () => {
    const { stdout } = await exec('./bin/ndjson-apply.js ./tests/assets/sync_transformer.js < ./tests/assets/sample.ndjson')
    const data = stdout.trim().split('\n').map(line => JSON.parse(line))
    data.should.deepEqual([
      { a: 123, b: 456, total: 579 },
      { a: 789, b: 123, total: 912 },
    ])
  })

  describe('CommonJS', () => {
    it('should accept a CommonJS file', async () => {
      const { stdout } = await exec('./bin/ndjson-apply.js ./tests/assets/sync_transformer.cjs 10 < ./tests/assets/sample.ndjson')
      const data = stdout.trim().split('\n').map(line => JSON.parse(line))
      data.should.deepEqual([
        { a: 123, b: 456, total: 589 },
        { a: 789, b: 123, total: 922 },
      ])
    })

    it('should accept a CommonJS subfunction', async () => {
      const { stdout } = await exec('./bin/ndjson-apply.js ./tests/assets/function_collection.cjs multiply 10 < ./tests/assets/sample.ndjson')
      const data = stdout.trim().split('\n').map(line => JSON.parse(line))
      data.should.deepEqual([
        { a: 123, b: 456, total: 560880 },
        { a: 789, b: 123, total: 970470 },
      ])
    })
  })
})

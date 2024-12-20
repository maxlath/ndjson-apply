#!/usr/bin/env node
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { program } from 'commander'
import split from 'split'
import through from 'through'
import handleErrors from '../lib/handle_errors.js'
import lineTransformers from '../lib/line_transformers.js'
import { isAsyncFunction } from '../lib/utils.js'
import { helpText } from '../lib/help.js'

const packageJson = await readFile(new URL('../package.json', import.meta.url))
const { version, description } = JSON.parse(packageJson)

program
.description(description)
.arguments('<js-function-module> [function-arguments...]')
.option('-a, --after <function-name>', 'Name of the function in the same module to call once all lines have been processed.')
.option('-d, --diff', 'Preview the changes between the input and the transformation output')
.option('-f, --filter', 'Use the js function only to filter lines: lines returning `true` will be let through. No transformation will be applied.')
.option('--get-executable-path', 'Get the ndjson-apply executable path')
.version(version)
.addHelpText('after', helpText)

program.parse(process.argv)

const [ fnModulePath, ...rawAdditionalArgs ] = program.args

const { diff: showDiff, filter: filterOnly, getExecutablePath, after } = program.opts()

if (getExecutablePath) {
  console.log(fileURLToPath(import.meta.url))
} else {
  if (!fnModulePath) {
    if (process.stdin.isTTY) program.help()
    else throw new Error('missing function module path')
  }

  const resolvedPath = path.resolve(fnModulePath)
  const exports = await import(resolvedPath)

  let transformFn, afterFn
  let additionalArgs = rawAdditionalArgs
  const possibleFunctionName = rawAdditionalArgs[0]
  if (possibleFunctionName && exports[possibleFunctionName] != null) {
    additionalArgs = rawAdditionalArgs.slice(1)
    transformFn = exports[possibleFunctionName]
  } else if (exports.default[possibleFunctionName] != null) {
    additionalArgs = rawAdditionalArgs.slice(1)
    transformFn = exports.default[possibleFunctionName]
  } else {
    transformFn = exports.default
  }

  if (typeof transformFn !== 'function') {
    const context = { resolvedPath, exports: Object.keys(exports), rawAdditionalArgs, additionalArgs }
    throw new Error(`transform function not found\n${JSON.stringify(context, null, 2)}`)
  }

  const transformer = isAsyncFunction(transformFn) ? lineTransformers.async : lineTransformers.sync

  if (after) {
    if (typeof exports[after] === 'function') {
      afterFn = exports[after]
    } else {
      const context = { resolvedPath, exports: Object.keys(exports) }
      throw new Error(`after function not found\n${JSON.stringify(context, null, 2)}`)
    }
  }

  process.stdin
  .pipe(split())
  .pipe(through(transformer(transformFn, showDiff, filterOnly, additionalArgs)))
  .on('close', async () => {
    if (afterFn) {
      const output = await afterFn()
      if (typeof output === 'string') process.stdout.write(output + '\n')
      else if (output) process.stdout.write(JSON.stringify(output) + '\n')
    }
  })
  .pipe(process.stdout)
  .on('error', handleErrors)
}

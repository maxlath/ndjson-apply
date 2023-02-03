#!/usr/bin/env node
import { readFile } from 'fs/promises'
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
.option('-d, --diff', 'Preview the changes between the input and the transformation output')
.option('-f, --filter', 'Use the js function only to filter lines: lines returning `true` will be let through. No transformation will be applied.')
.version(version)
.addHelpText('after', helpText)

program.parse(process.argv)

const [ fnModulePath, ...rawAdditionalArgs ] = program.args

const { diff: showDiff, filter: filterOnly } = program.opts()

if (!fnModulePath) {
  if (process.stdin.isTTY) program.help()
  else throw new Error('missing function module path')
}

const resolvedPath = path.resolve(fnModulePath)
const exports = await import(resolvedPath)

let transformFn
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

process.stdin
.pipe(split())
.pipe(through(transformer(transformFn, showDiff, filterOnly, additionalArgs)))
.pipe(process.stdout)
.on('error', handleErrors)

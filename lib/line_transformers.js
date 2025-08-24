import diff from './diff.js'

export default {
  sync: (transformFn, showDiff, filterOnly, additionalArgs) => function (line) {
    try {
      if (!line) return
      const data = JSON.parse(line)
      const transformedData = transformFn(data, ...additionalArgs)
      if (filterOnly) {
        if (transformedData === true) pushOutput.call(this, line, data)
      } else {
        pushOutput.call(this, line, transformedData, showDiff)
      }
    } catch (err) {
      console.error('sync transformation failed', err)
      throw err
    }
  },

  async: (transformFn, showDiff, filterOnly, additionalArgs) => async function (line) {
    try {
      if (!line) return
      // Pause and resume to keep lines in the same order as they arrived
      this.pause()
      const data = JSON.parse(line)
      const transformedData = await transformFn(data, ...additionalArgs)
      if (filterOnly) {
        if (transformedData === true) pushOutput.call(this, line, data)
      } else {
        pushOutput.call(this, line, transformedData, showDiff)
      }
      this.resume()
    } catch (err) {
      console.error('async transformation failed', err)
      throw err
    }
  },
}

const pushOutput = function (line, transformedData, showDiff) {
  if (transformedData == null) return
  let output
  if (showDiff) {
    // Re-parsing the original line to avoid using a modified object
    const originalData = JSON.parse(line)
    output = diff(originalData, transformedData)
  } else {
    output = JSON.stringify(transformedData)
  }
  this.queue(output + '\n')
}

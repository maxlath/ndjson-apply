const diff = require('./diff')

module.exports = {
  sync: (transformFn, showDiff) => function (line) {
    if (!line) return
    const data = JSON.parse(line)
    const transformedData = transformFn(data)
    pushOutput.call(this, line, transformedData, showDiff)
  },

  async: (transformFn, showDiff) => async function (line) {
    if (!line) return
    // Pause and resume to keep lines in the same order as they arrived
    this.pause()
    const data = JSON.parse(line)
    const transformedData = await transformFn(data)
    pushOutput.call(this, line, transformedData, showDiff)
    this.resume()
  }
}

const pushOutput = function (line, transformedData, showDiff) {
  if (transformedData == null && !showDiff) return
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

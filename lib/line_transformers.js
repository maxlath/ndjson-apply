module.exports = {
  sync: transformFn => function (line) {
    if (!line) return
    const data = JSON.parse(line)
    const transformedData = transformFn(data)
    if (transformedData == null) return
    const transformedLine = JSON.stringify(transformedData)
    this.queue(transformedLine + '\n')
  },

  async: transformFn => async function (line) {
    if (!line) return
    // Pause and resume to keep lines in the same order as they arrived
    this.pause()
    const data = JSON.parse(line)
    const transformedData = await transformFn(data)
    if (transformedData == null) return
    const transformedLine = JSON.stringify(transformedData)
    this.queue(transformedLine + '\n')
    this.resume()
  }
}

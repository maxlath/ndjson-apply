const { green, red, grey } = require('tiny-chalk')
const { diffLines } = require('diff')
const stringify = obj => JSON.stringify(obj, null, 2)

module.exports = (originalData, transformedData) => {
  let text = ''

  diffLines(stringify(originalData), stringify(transformedData))
  .forEach(part => {
    const { added, removed, value } = part
    if (added) text += green(value)
    else if (removed) text += red(value)
    else text += grey(value)
  })

  return text
}

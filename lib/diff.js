import { diffLines } from 'diff'
import { green, red, grey } from 'tiny-chalk'

const stringify = obj => JSON.stringify(obj, null, 2)

export default (originalData, transformedData) => {
  if (!transformedData) return grey(stringify(originalData))

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

let ops = 0

export const multiply = (doc, bonus = '1') => {
  bonus = parseInt(bonus)
  doc.total = doc.a * doc.b * bonus
  ops++
  return doc
}

export const multiplyAsync = async (doc, bonus = '1') => {
  bonus = parseInt(bonus)
  doc.total = doc.a * doc.b * bonus
  return doc
}

export function logOpsCount () {
  console.error(`ops=${ops}`)
}

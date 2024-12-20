let sum = 0

export function addScore (doc) {
  sum += doc.a
}

export function outputSum () {
  return sum
}

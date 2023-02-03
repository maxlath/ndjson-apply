export default function (doc, bonus = '0') {
  doc.total = doc.a + doc.b + parseInt(bonus)
  return doc
}

export function someOtherSyncTransformer (doc, malus = '10') {
  doc.total = doc.a + doc.b - parseInt(malus)
  return doc
}

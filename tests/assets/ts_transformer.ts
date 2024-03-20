export async function someTsAsyncTransformer (doc, malus: string = '10') {
  doc.total = doc.a + doc.b - parseInt(malus)
  return doc
}

export default doc => {
  doc.total = doc.a + doc.b
  if (doc.total % 2 === 0) return doc
}

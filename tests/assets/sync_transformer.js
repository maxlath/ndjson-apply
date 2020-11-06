module.exports = (doc, bonus = '0') => {
  doc.total = doc.a + doc.b + parseInt(bonus)
  return doc
}

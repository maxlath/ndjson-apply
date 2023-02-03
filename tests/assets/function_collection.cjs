module.exports = {
  multiply: (doc, bonus = '1') => {
    bonus = parseInt(bonus)
    doc.total = doc.a * doc.b * bonus
    return doc
  },
}

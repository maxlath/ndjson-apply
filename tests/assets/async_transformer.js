const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

const getRemoteValue = async () => {
  const ms = Math.trunc(Math.random() * 10)
  await wait(ms)
  return 100
}

module.exports = async (doc, bonus = '0') => {
  const remoteValue = await getRemoteValue()
  bonus = parseInt(bonus)
  doc.total = doc.a + doc.b + remoteValue + bonus
  return doc
}

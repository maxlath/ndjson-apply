const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

const getRemoteValue = async () => {
  const ms = Math.trunc(Math.random() * 100)
  await wait(ms)
  return 100
}

module.exports = async doc => {
  const remoteValue = await getRemoteValue()
  doc.total = doc.a + doc.b + remoteValue
  return doc
}

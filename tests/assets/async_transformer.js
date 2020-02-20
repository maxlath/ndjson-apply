const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

const getRemoteValue = async () => {
  await wait(1)
  return 100
}

module.exports = async doc => {
  const remoteValue = await getRemoteValue()
  doc.total = doc.a + doc.b + remoteValue
  return doc
}

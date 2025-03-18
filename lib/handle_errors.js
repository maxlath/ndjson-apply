export default err => {
  // If the next stream refuse the input
  // this stream should stop
  // see: http://stackoverflow.com/a/15884508/3324977
  if (err.code !== 'EPIPE') {
    console.error(err)
  }
}

const AsyncFunction = (async () => {}).constructor

module.exports = {
  // inspired by https://stackoverflow.com/a/38510353/3324977
  isAsyncFunction: fn => fn instanceof AsyncFunction
}

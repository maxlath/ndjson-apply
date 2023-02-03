const AsyncFunction = (async () => {}).constructor

// Inspired by https://stackoverflow.com/a/38510353/3324977
export const isAsyncFunction = fn => fn instanceof AsyncFunction
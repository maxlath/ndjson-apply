# ndjson-apply
Apply a JS function to a stream of newline-delimited JSON.

Features:
* take the JS function to apply from a file
* the function may return async results
* preview the transformation results with the `--diff` option

[![NPM](https://nodei.co/npm/ndjson-apply.png?stars&downloads&downloadRank)](https://npmjs.com/package/ndjson-apply/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node](https://img.shields.io/badge/node-%3E=%20v7.6.0-brightgreen.svg)](http://nodejs.org)

## Install
```sh
npm i -g ndjson-apply
```

## How To

### Basic
```sh
cat some_data.ndjson | ndjson-apply some_transform_fn.js > some_data_transformed.ndjson
# Which can also be written
ndjson-apply some_transform_fn.js < cat some_data.ndjson > some_data_transformed.ndjson
```
where `some_transform_fn.js` just needs to export a JS function
```js
// some_transform_fn.js
module.exports = doc => {
  doc.total = doc.a + doc.b
  if (doc.total % 2 === 0) {
    return doc
  } else {
    // returning null or undefined drops the entry
  }
}
```

### Async
That function can also be async:
```js
const getSomeExtraData = require('./path/to/get_some_extra_data')

// some_async_transform_fn.js
module.exports = async doc => {
  doc.total = doc.a + doc.b
  if (doc.total % 2 === 0) {
    doc.extraData = await getSomeExtraData(doc)
    return doc
  } else {
    // returning null or undefined drops the entry
  }
}
```

### Diff mode
As a way to preview the results of your transformation, you can use the diff mode
```sh
cat some_data.ndjson | ndjson-apply some_transform_fn.js --diff
```
which will display a colored diff of each line before and after transformation.

For more readability, each line diff output is indented and on several lines.

### Filter mode
Use the js function only to filter lines: lines returning `true` will be let through. No transformation will be applied.
```sh
cat some_data.ndjson | ndjson-apply some_transform_fn.js --filter
```

### Use sub-function
Given a `function_collection.js` file like:
```js
// function_collection.js
module.exports = {
  foo: (obj) => {
    obj.timestamp = Date.now()
    return obj
  },
  bar: (obj) => {
    obj.count += obj.count
    return obj
  }
}
```

You can use those subfunction by passing there key as an additional argument
```sh
cat some_data.ndjson | ndjson-apply ./function_collection.js foo
cat some_data.ndjson | ndjson-apply ./function_collection.js bar
```

## See also
* [jq](https://stedolan.github.io/jq/) is great to work with NDJSON: `cat entries_array.json | jq '.[]' -cr > entries.ndjson`
* [ndjson-cli#map](https://github.com/mbostock/ndjson-cli#map)

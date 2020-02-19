# ndjson-apply

## Install
```sh
npm i -g ndjson-apply
```

## How To
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

## See also
* [ndjson-cli#map](https://github.com/mbostock/ndjson-cli#map)

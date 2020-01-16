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

## See also
* [ndjson-cli#map](https://github.com/mbostock/ndjson-cli#map)

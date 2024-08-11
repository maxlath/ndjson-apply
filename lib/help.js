export const helpText = `
Examples:
  # Create a transform function in a ES format
  echo '
  export default function (entry) {
    entry.total = entry.countA + entry.countB
    return entry
  }
  ' > some_transform_function.mjs

  # Use it to transform ndjson entries
  cat some_data.ndjson | ndjson-apply some_transform_function.mjs > some_data_transformed.ndjson

  # Preview transformation changes
  cat some_data.ndjson | ndjson-apply some_transform_function.mjs --diff

  # Create a filter function
  echo '
  export default function (entry) {
    return entry.total > 5
  }
  ' > some_filter_function.mjs

  # Filter entries
  cat some_data_transformed.ndjson | ndjson-apply some_filter_function.mjs --filter > some_data_with_total_above_5.ndjson

  ### Use sub-function
  echo '
  export function foo (obj) {
    obj.timestamp = Date.now()
    return obj
  }
  export function bar (obj) {
    obj.count += obj.count
    return obj
  }
  ' > function_collection.js

  cat some_data.ndjson | ndjson-apply ./function_collection.js foo
  cat some_data.ndjson | ndjson-apply ./function_collection.js bar

  # Create a transform function that takes extra arguments from the command line
  echo '
  export default function (entry, bonus) {
    entry.total = entry.countA + entry.countB + parseInt(bonus)
    return entry
  }
  ' > some_dynamic_transform_function.mjs

  cat some_data.ndjson | ndjson-apply some_dynamic_transform_function.mjs 500 > some_data_transformed_with_bonus_500.ndjson
  cat some_data.ndjson | ndjson-apply some_dynamic_transform_function.mjs 1000 > some_data_transformed_with_bonus_1000.ndjson
`

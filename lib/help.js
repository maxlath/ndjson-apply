export const helpText = `
Examples:
  # Create a transform function in a CommonJS format
  echo '
  export default function (entry) {
    entry.total = entry.countA + entry.countB
    return entry
  }
  ' > some_transform_function.js

  # Use it to transform ndjson entries
  cat some_data.ndjson | ndjson-apply some_transform_function.js > some_data_transformed.ndjson

  # Preview transformation changes
  cat some_data.ndjson | ndjson-apply some_transform_function.js --diff

  # Create a filter function
  echo '
  export default function (entry) {
    return entry.total > 5
  }
  ' > some_filter_function.js

  # Filter entries
  cat some_data_transformed.ndjson | ndjson-apply some_filter_function.js --filter > some_data_with_total_above_5.ndjson

  # Create a transform function that takes extra arguments from the command line
  echo '
  export default function (entry, bonus) {
    entry.total = entry.countA + entry.countB + parseInt(bonus)
    return entry
  }
  ' > some_dynamic_transform_function.js

  cat some_data.ndjson | ndjson-apply some_transform_function.js 500 > some_data_transformed_with_bonus_500.ndjson
  cat some_data.ndjson | ndjson-apply some_transform_function.js 1000 > some_data_transformed_with_bonus_1000.ndjson
`

#!/usr/bin/env bash
set -eu

which tsx > /dev/null || {
  echo 'requires to have tsx (https://github.com/privatenumber/tsx) installed: npm install --global tsx'
  exit 1
}

tsx "$(ndjson-apply --get-executable-path)" "$@"

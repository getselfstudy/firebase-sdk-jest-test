#!/bin/bash -e

TMP=.tsconfig-lint.json
cat >$TMP <<EOF
{
  "extends": "./tsconfig.json",
  "include": [
EOF
for file in "$@"; do
  echo "    \"$file\"," >> $TMP
done
cat >>$TMP <<EOF
    "unused"
  ]
}
EOF
yarn tsc --project $TMP --skipLibCheck --noEmit
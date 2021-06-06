#!/usr/bin/env bash
set -e

mkdir -p data/snippets/
rm -rf highlight.js

hljsVersion=$(cat package.json | jq -re '.dependencies["highlight.js"]')

echo "Using out highlight.js $hljsVersion..."
git config --global advice.detachedHead false
git clone -b "$hljsVersion" https://github.com/highlightjs/highlight.js.git

cd highlight.js
for folder in test/detect/*
do
  if [[ -f $folder ]]; then
    continue
  fi

  filename=$(basename $folder)
  cp "$folder/default.txt" "../data/snippets/$filename.txt"
done

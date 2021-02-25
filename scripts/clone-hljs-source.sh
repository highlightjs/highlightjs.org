#!/usr/bin/env bash

mkdir -p data/snippets/

rm -rf highlight.js
git clone https://github.com/highlightjs/highlight.js.git

cd highlight.js
npm ci
node tools/build.js -t node

for folder in test/detect/*
do
  if [[ -f $folder ]]; then
    continue
  fi

  filename=$(basename $folder)
  cp "$folder/default.txt" "../data/snippets/$filename.txt"
done

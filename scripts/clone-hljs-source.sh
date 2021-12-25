#!/usr/bin/env bash
set -e

clean_data_dir() {
  mkdir -p data/{downloads,snippets}/
  rm -rf highlight.js
}

clone_hljs_repo() {
  hljsVersion=$(cat package.json | jq -re '.dependencies["highlight.js"]')

  echo "Using out highlight.js $hljsVersion..."
  git config --global advice.detachedHead false
  git clone -b "$hljsVersion" https://github.com/highlightjs/highlight.js.git

  cd highlight.js
}

get_code_snippets() {
  for folder in test/detect/*
  do
    if [[ -f $folder ]]; then
      continue
    fi

    filename=$(basename $folder)
    cp "$folder/default.txt" "../data/snippets/$filename.txt"
  done
}

build_hljs_download() {
  npm i
  node tools/build.js -t cdn

  cp build/languages/* "../data/downloads/"
  cp build/highlight.min.js "../data/downloads/"
}

clean_data_dir
clone_hljs_repo
get_code_snippets
build_hljs_download

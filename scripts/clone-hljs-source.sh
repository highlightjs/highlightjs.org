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
  # The Heroku deployment pipeline sets NODE_ENV to production, meaning that
  # we need to be explicit about installing dev dependencies for highlight.js
  # otherwise they won't get installed.
  npm install --production=false

  # Build highlight.js in CDN mode so that we have each language in their own
  # file that can be concatenated.
  node tools/build.js -t cdn

  cp build/languages/* "../data/downloads/"
  cp build/highlight.min.js "../data/downloads/"
}

clean_data_dir
clone_hljs_repo
get_code_snippets
build_hljs_download

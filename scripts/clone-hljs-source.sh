#!/usr/bin/env bash
set -e

HLJS_REPO="https://github.com/highlightjs/highlight.js.git"
HLJS_COMMIT="366a8bd012f33a8f56edfceb9f244fa1f672732f"

clean_data_dir() {
  mkdir -p data/{downloads,snippets}/
  mkdir -p data/downloads/es/
  rm -rf highlight.js
}

clone_hljs_repo() {
  # Purposely not using something like `jq` for environments that don't have it installed (e.g. Vercel)
  hljsVersion=$(grep -o '"highlight.js": "[^"]*' package.json | cut -d'"' -f4)

  git config --global advice.detachedHead false

  if [ -z "$HLJS_COMMIT" ]; then
    echo "Using highlight.js $hljsVersion..."
    git clone -b "$hljsVersion" "$HLJS_REPO"
  else
    echo "Using highlight.js commit $HLJS_COMMIT"
    git clone --depth 50 "$HLJS_REPO"
    git -C highlight.js reset --hard $HLJS_COMMIT
  fi

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

  node tools/build.js --no-minify -t cdn
  rm -f build/languages/*.js.js
  cp build/highlight.js "../data/downloads/"
  cp build/languages/*.js "../data/downloads/"
  cp build/es/highlight.js "../data/downloads/es/"
  cp build/es/languages/*.js "../data/downloads/es/"

  # Build highlight.js in CDN mode so that we have each language in their own
  # file that can be concatenated.
  node tools/build.js -t cdn

  cp build/es/languages/* "../data/downloads/es/"
  cp build/es/highlight.min.js "../data/downloads/es/"
  cp build/languages/* "../data/downloads/"
  cp build/highlight.min.js "../data/downloads/"
  cp build/DIGESTS.md "../data/"
}

clean_data_dir
clone_hljs_repo
get_code_snippets
build_hljs_download

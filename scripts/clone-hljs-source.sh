#!/usr/bin/env bash

rm -rf highlight.js
git clone https://github.com/highlightjs/highlight.js.git

cd highlight.js
npm ci

node tools/build.js -t node

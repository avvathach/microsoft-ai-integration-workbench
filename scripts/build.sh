#!/usr/bin/env sh
set -eu

mkdir -p dist
cp index.html app.js styles.css dist/

printf '%s\n' "Built static site in dist/"

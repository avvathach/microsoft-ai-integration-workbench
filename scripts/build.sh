#!/usr/bin/env sh
set -eu

mkdir -p dist
cp app.js styles.css dist/
mkdir -p dist/assets
cp assets/* dist/assets/

css_version=$(sha256sum styles.css | cut -c1-12)
js_version=$(sha256sum app.js | cut -c1-12)

sed \
  -e "s|href=\"./styles.css\"|href=\"./styles.css?v=$css_version\"|" \
  -e "s|src=\"./app.js\"|src=\"./app.js?v=$js_version\"|" \
  index.html > dist/index.html

printf '%s\n' "Built static site in dist/ with versioned assets"

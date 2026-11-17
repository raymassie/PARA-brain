#!/bin/sh
cd "$(dirname "$0")" || exit 1
if ! command -v node >/dev/null 2>&1; then
  for candidate in "$HOME"/.nvm/versions/node/*/bin; do
    [ -x "$candidate/node" ] && PATH="$candidate:$PATH"
  done
  export PATH
fi
if ! command -v node >/dev/null 2>&1; then
  echo 'PARA Clipper needs Node.js 22 or newer. Install it from https://nodejs.org, then open this file again.'
  read -r reply
  exit 1
fi
node System/scripts/web-clipper/start.mjs

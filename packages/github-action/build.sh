#!/bin/sh
set -e
set -x

yarn tsup --config ./tsup/tsup.cjs.ts
yarn tsup --config ./tsup/tsup.esm.ts

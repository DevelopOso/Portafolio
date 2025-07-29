#!/bin/bash

echo Node Version: $(node --version)
echo PNPM Version: $(pnpm --version)

set -eux
rm ~/.npmrc | true

bun i || exit 1

#!/bin/bash

cd ./delete-batch/ || return

yarn install
yarn build

cd ../

CURRENT_MODE=debug \
SAMPLE_STRING=xxx \
node ./delete-batch/dist/bundled.js
#node --inspect-brk=9229 ./delete-batch/dist/bundled.js
# break貼って調査したいならこっち

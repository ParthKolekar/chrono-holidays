#!/bin/bash
find lib -name '*.json' -print0 | xargs -0 -I{} sh -c 'jq -c . < '{}' |tee '{}

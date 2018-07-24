#!/usr/bin/env bash
set -e

application=$1

if [ "$application" ]; then
    hash=$(git ls-files ./applications/$application/ | git hash-object --stdin-paths | git hash-object --stdin)
else
    hash=$(git ls-files ./applications/ | git hash-object --stdin-paths | git hash-object --stdin)
fi

echo $hash


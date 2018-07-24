#!/usr/bin/env bash
set -e

application=$1

# example
# echo $(./citools/getBuildTag.sh search)

if [[ -z $application ]]; then
    echo "Application cannot be empty"
    exit 1
fi

hash=$(${BASH_SOURCE%/*}/calculateApplicationHash.sh $application)

echo "build-$hash"

#!/usr/bin/env bash
set -e

applications=$1

# example
# echo $(./citools/getBuildTag.sh "search")

if [[ -z $applications ]]; then
    echo "Applications cannot be empty"
    exit 1
fi

hash=$(${BASH_SOURCE%/*}/calculateApplicationsHash.sh "$applications")

echo "build-$hash"

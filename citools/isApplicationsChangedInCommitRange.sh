#!/usr/bin/env bash
set -e

# inspired by https://github.com/sagikazarmark/travis-monorepo-demo/blob/master/.travis/build-condition.sh

commitRange=$1
commitRange=${commitRange/.../..} #travis gives commit range with ... but for git diff we need ..
applications=($2)

if [[ -z $commitRange ]]; then
    echo "Commit range cannot be empty"
    exit 1
fi

if [[ -z $applications ]]; then
    echo "Applications cannot be empty"
    exit 1
fi

# build regex for grepping
condPrefix='|^applications/'
concatenated="$( printf "${condPrefix}%s/" "${applications[@]}" )"
# remove leading character from the concatenated regex
appsRegex="${concatenated:1}"

echo "Checking commit range $commitRange match for patterns $appsRegex"

git diff --name-only $commitRange | sort -u | uniq | egrep $appsRegex  > /dev/null

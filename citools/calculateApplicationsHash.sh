#!/usr/bin/env bash
set -e

applications=($1)

if [[ -z $applications ]]; then
    echo "Applications cannot be empty"
    exit 1
fi

# build regex for grepping
condPrefix='|^applications/'
concatenated="$( printf "${condPrefix}%s/" "${applications[@]}" )"
# remove leading character from the concatenated regex
appsRegex="${concatenated:1}"

# test regex matching
#echo $appsRegex
#git ls-files | sort -u | uniq | egrep $appsRegex

git ls-files | sort -u | uniq | egrep $appsRegex | git hash-object --stdin-paths|git hash-object --stdin
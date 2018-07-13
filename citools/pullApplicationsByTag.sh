#!/usr/bin/env bash
set -e

# pull list of application images with tag

# usage example
# if ./citools/applicationsTagExistInDockerHub.sh "search registration-react" ut1_2018-05-11T10_06_55; then echo yes; else echo no; fi
# ./citools/applicationsTagExistInDockerHub.sh "search registration-reacts" ut1_2018-05-11T10_06_55 && echo yes || echo no

applications=($1)
tag=$2

if [[ -z $tag ]]; then
    echo "Tag cannot be empty"
    exit 1
fi

if [[ -z $applications ]]; then
    echo "Applications cannot be empty"
    exit 1
fi

for application in "${applications[@]}"
do
    docker pull dcatno/$application:$tag
done

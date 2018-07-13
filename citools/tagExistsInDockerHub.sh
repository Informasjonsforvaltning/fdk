#!/usr/bin/env bash
set -e

# check if an image with a tag exists in dockerhub.

# usage example
# if ./citools/tagExistsInDockerHub.sh dcatno/search ut1_2018-05-11T10_06_55; then echo yes; else echo no; fi
# ./citools/tagExistsInDockerHub.sh dcatno/search ut1_2018-05-11T10_06_5 && echo yes || echo no

image=$1
tag=$2

#echo https://hub.docker.com/v2/repositories/$image/tags/$tag

curl --silent -f -lSL https://hub.docker.com/v2/repositories/$image/tags/$tag > /dev/null
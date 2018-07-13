#!/usr/bin/env bash
set -e

# tag existing application images with new tags
# assume the tag is pulled before
# tag the latest of each built application and push

applications=$1
oldTag=$2
newTag=$3
push=$4

for application in $applications
  do
    echo "Tagging dcatno/$application:$oldTag as dcatno/$application:$newTag"
    docker tag dcatno/$application:$oldTag dcatno/$application:$newTag

    if [ "$push" = "push" ]
    then
        echo "Pushing dcatno/$application:$newTag to dockerhub"
        docker push dcatno/$application:$newTag
    fi
done

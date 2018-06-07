#!/usr/bin/env bash

componentHash=`find . -type d -name target -prune -o -type f -exec md5sum {} \; | sort -z | md5sum`

echo $componentHash
truncatedHash=${componentHash:0:3}

foundOnDockerHub=`docker pull dcatno/harvester:build_${truncatedHash} | grep "Pulling"`

echo "====="
echo ${foundOnDockerHub}

if [[ "${foundOnDockerHub}" = *"Pulling"* ]] ; then
    echo "image found on Docker hub - no build neccessary"
else
    echo "image not found on Docker Hub - building module"
    mvn install -Dmaven.javadoc.skip=true
    docker tag dcatno/harvester:latest dcatno/harvester:build_${truncatedHash}
    docker push dcatno/harvester:build_${truncatedHash}
fi




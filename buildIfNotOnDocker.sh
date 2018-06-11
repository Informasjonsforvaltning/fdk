#!/usr/bin/env bash

if [ $# -ne 2 ]
then
  echo "Usage: buildIfNotOnDocker moduleName pathToPom\n\\r Example: ./buildIfNotOnDocker.sh dcatno/harvester find ."
  exit 1
fi

moduleName=$1
pathToPom=$2


componentHash=`find ${pathToPom} -not -path "${pathToPom}/target" -type d -name target -prune -o -type f -exec md5sum {} \; | sort -z | md5sum`

echo $componentHash
truncatedHash=${componentHash:0:3}

foundOnDockerHub=`docker pull ${moduleName}:build_${truncatedHash} | grep "Pulling"`

echo "====="
echo ${foundOnDockerHub}

if [[ "${foundOnDockerHub}" = *"Pulling"* ]] ; then
    echo "image found on Docker hub - no build neccessary"
else
    echo "image not found on Docker Hub - building module"
    mvn install -Dmaven.javadoc.skip=true -f ${pathToPom}
    docker tag ${moduleName}:latest ${moduleName}:build_${truncatedHash}
    docker push ${moduleName}:build_${truncatedHash}
fi




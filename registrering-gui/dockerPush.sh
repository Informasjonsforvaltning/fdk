#!/usr/bin/env bash
set -e

BRANCH=`git branch | grep "*" | awk '{gsub ( "[* ]","" ) ; print $0 }'`

echo "$BRANCH";


if [ "${BRANCH}" = "develop" ] ; then

  echo "Preparing to push 'registrering-gui' to docker"

  docker login --username ${dockerUsername} --password ${dockerPassword}

  docker tag dcatno/registration:latest dcat/reg-gui:latest

  docker push dcat/reg-gui:latest

fi

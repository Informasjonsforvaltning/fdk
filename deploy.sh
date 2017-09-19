#!/usr/bin/env bash
set -e

git fetch

GIT_STATUS=`git status | grep "Your branch is up-to-date with"`
if [ "${GIT_STATUS}" != "Your branch is up-to-date with 'origin/develop'." ] ; then
  echo "You need to be on origin/develop and be up to date with origin";
  exit;
fi

git fetch --all --tags --prune

  DATETIME=`date "+%Y-%m-%dT%H_%M_%S"`


if [ "$1" == "st1" ] ; then

 docker login --username ${dockerUsername} --password ${dockerPassword}

 docker pull dcatno/registration:latest
 docker tag dcatno/registration:latest dcatno/registration:st1_latest
 docker push dcatno/registration:st1_latest
 docker tag dcatno/registration:latest dcatno/registration:st1_${DATETIME}
 docker push dcatno/registration:st1_${DATETIME}

  git push --delete origin st1_latest || true
  git tag --delete st1_latest || true

   git tag st1_latest
   git tag st1_${DATETIME}

  git push origin --tags

  echo "here"

fi

if [ "$1" == "tt1" ] ; then

 docker login --username ${dockerUsername} --password ${dockerPassword}

 docker pull dcatno/registration:st1_latest
 docker tag dcatno/registration:st1_latest dcatno/registration:tt1_latest
 docker push dcatno/registration:tt1_latest
 docker tag dcatno/registration:st1_latest dcatno/registration:tt1_${DATETIME}
 docker push dcatno/registration:tt1_${DATETIME}


  git push --delete origin tt1_latest || true
  git tag --delete tt1_latest || true

  git checkout tags/st1_latest

   git tag tt1_latest
   git tag tt1_${DATETIME}

  git checkout develop
  git push origin --tags

  echo "here"

fi
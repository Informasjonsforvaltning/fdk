#!/usr/bin/env bash
set -e

BUILD_APP=$1
BUILD_CMD=$2

SECONDS=0 # start timer

echo "----------------------------------"
echo "Starting build of application $BUILD_APP"
echo "----------------------------------"

# skip build if all application images are already in dockerhub
buildtag=$(./citools/getBuildTag.sh $BUILD_APP)

if [ "$FORCE_BUILD" != "true" ]
then
    echo "Checking if applications image is already built and tagged with $buildtag"
    if ./citools/applicationsTagExistInDockerHub.sh $BUILD_APP $buildtag
    then
      echo "----------------------------------"
      echo "Skipping build of application"
      echo "Build image with tag $buildtag is already in dockerhub for application $BUILD_APP"
      echo "----------------------------------"
      echo "SECONDS"
      echo $SECONDS
      exit 0
    fi
fi

#build
echo "Launching group build command"
eval $BUILD_CMD

echo "SECONDS"
echo $SECONDS

echo "Tag and push built image to dockerhub"
./citools/retagApplications.sh $BUILD_APP latest $buildtag push

echo "Done build of application $BUILD_APP"
echo "SECONDS"
echo $SECONDS



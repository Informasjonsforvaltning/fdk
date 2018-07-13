#!/usr/bin/env bash
set -e

#list of applications is copied from travisPushToDockerHub.sh which defines the containers to build&deploy
BUILD_APPS=$1
BUILD_CMD=$2

SECONDS=0 # start timer

echo "----------------------------------"
echo "Starting build of application group"
echo $BUILD_APPS
echo "----------------------------------"

# skip build if all application images are already in dockerhub
buildtag=$(./citools/getBuildTag.sh "$BUILD_APPS")
echo "Checking if all applications have images already built and tagged with $buildtag"
if ./citools/applicationsTagExistInDockerHub.sh "$BUILD_APPS" $buildtag
then
    echo "----------------------------------"
    echo "Skipping build of application group"
    echo "Build images with tag $buildtag are already in dockerhub for all applications $BUILD_APPS"
    echo "----------------------------------"
    echo "Pulling images with tag $buildtag"
    ./citools/pullApplicationsByTag.sh "$BUILD_APPS" $buildtag
    # tag the downloaded images as latest to allow docker-compose to use them
    .citools/retagApplications.sh "$BUILD_APPS" $buildtag latest
    echo "SECONDS"
    echo $SECONDS
    exit 0
fi

#build
echo "Launching group build command"
eval $BUILD_CMD

echo "SECONDS"
echo $SECONDS



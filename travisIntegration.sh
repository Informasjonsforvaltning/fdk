#!/usr/bin/env bash
set -e

SECONDS=0 # start timer

source ./buildGroupsEnv.sh

integrationtag=$(./citools/getIntegrationTag.sh)
echo "Checking if all applications have images already integration-tested and tagged with $integrationtag"

#skip integration stage, if all already passed before
if ./citools/applicationsTagExistInDockerHub.sh "$INTEGRATION_APPS" $integrationtag
then
    echo "----------------------------------"
    echo "Skipping integration tests"
    echo "Integration images with tag $integrationtag are already in dockerhub for all applications INTEGRATION_APPS"
    echo "----------------------------------"
    echo "SECONDS"
    echo $SECONDS
    exit 0
fi

echo "SECONDS"
echo $SECONDS

echo "Getting build tags for all build groups"
BUILD1_buildtag=$(./citools/getBuildTag.sh "$BUILD1_APPS")
BUILD2_buildtag=$(./citools/getBuildTag.sh "$BUILD2_APPS")
BUILD3_buildtag=$(./citools/getBuildTag.sh "$BUILD3_APPS")

echo "SECONDS"
echo $SECONDS

echo "Pull images of all build groups - exit with error when any build image is missing"
./citools/pullApplicationsByTag.sh "$BUILD1_APPS" $BUILD1_buildtag
./citools/pullApplicationsByTag.sh "$BUILD2_APPS" $BUILD2_buildtag
./citools/pullApplicationsByTag.sh "$BUILD3_APPS" $BUILD3_buildtag

echo "SECONDS"
echo $SECONDS

# TODO Run integration tests on the pulled images

if [ "$dockerUsername" ]
then
    docker login --username ${dockerUsername} --password ${dockerPassword}
fi

echo "Integration tests passed, tag images with $integrationtag"

./citools/retagApplications.sh "$BUILD1_APPS" $BUILD1_buildtag $integrationtag push
./citools/retagApplications.sh "$BUILD2_APPS" $BUILD2_buildtag $integrationtag push
./citools/retagApplications.sh "$BUILD3_APPS" $BUILD3_buildtag $integrationtag push

echo "SECONDS"
echo $SECONDS


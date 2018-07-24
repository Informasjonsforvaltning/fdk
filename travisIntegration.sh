#!/usr/bin/env bash
set -e

SECONDS=0 # start timer
source ./buildGroupsEnv.sh

applications="${BUILD_APPS[@]}"
integrationtag=$(./citools/getIntegrationTag.sh)
echo "Checking if all applications (${BUILD_APPS[@]}) have images already integration-tested and tagged with $integrationtag"

#skip integration stage, if all already passed before
if ./citools/applicationsTagExistInDockerHub.sh "$applications" $integrationtag
then
    echo "----------------------------------"
    echo "Skipping integration tests"
    echo "Integration images with tag $integrationtag are already in dockerhub for all applications ($applications)"
    echo "----------------------------------"
    echo "SECONDS"
    echo $SECONDS
    exit 0
fi

echo "SECONDS"
echo $SECONDS

echo "Get build tags for all build groups"
for i in "${!BUILD_APPS[@]}"; do
    buildtag[$i]=$(./citools/getBuildTag.sh "${BUILD_APPS[$i]}")
done

echo "SECONDS"
echo $SECONDS

echo "Pull images of all build groups - exit with error when any build image is missing"
for i in "${!BUILD_APPS[@]}"; do
    ./citools/pullApplicationsByTag.sh "${BUILD_APPS[$i]}" "${buildtag[$i]}"
done

echo "SECONDS"
echo $SECONDS

# TODO Run integration tests on the pulled images

if [ "$dockerUsername" ]
then
    docker login --username ${dockerUsername} --password ${dockerPassword}
fi

echo "Integration tests passed, tag images with $integrationtag"

for i in "${!BUILD_APPS[@]}"; do
    ./citools/retagApplications.sh "${BUILD_APPS[$i]}" ${buildtag[$i]} $integrationtag push
done

echo "SECONDS"
echo $SECONDS


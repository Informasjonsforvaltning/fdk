#!/usr/bin/env bash
set -e

SECONDS=0 # start timer
source ./buildGroupsEnv.sh
errors=0

if [ "$dockerUsername" ]
then
    docker login --username ${dockerUsername} --password ${dockerPassword}
fi

for i in "${!BUILD_APPS[@]}"; do
    echo "Checking ${BUILD_APPS[$i]}"
    # error does not exit script because it is in condition
    if ! ./buildAndPushApplication.sh "${BUILD_APPS[$i]}" "${BUILD_CMD[$i]}"
    then
        echo "ERROR buildAndPush ${BUILD_APPS[$i]}"
        errors=$((errors+1))
    fi
    echo "SECONDS"
    echo $SECONDS
done

if (( errors > 0 ))
then
    echo "Total errors: $errors"
    exit 1
fi

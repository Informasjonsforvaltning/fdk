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
    # error does not exit script because it is in condition
    if ! ./buildAndPushApplicationGroup.sh "${BUILD_APPS[$i]}" "${BUILD_CMD[$i]}"
    then
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

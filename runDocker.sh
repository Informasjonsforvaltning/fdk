#!/usr/bin/env bash
set -e

. ./buildGroupsEnv.sh

for i in "${!BUILD_APPS[@]}"; do
    if [ "$1" == "${BUILD_APPS[$i]}" ]; then
        ./buildApplication.sh "${BUILD_APPS[$i]}" "${BUILD_CMD[$i]}"
    fi
done

docker-compose stop $1 || true
docker-compose up -d $1

if [ "$2" == "logs" ]; then
   docker-compose logs -f $1
fi

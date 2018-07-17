#!/usr/bin/env bash
set -e

. ./buildGroupsEnv.sh

# We will build what is needed and download images that are missing
./buildOrPullApplicationGroup.sh "$BUILD1_APPS" "$BUILD1_CMD"
./buildOrPullApplicationGroup.sh "$BUILD2_APPS" "$BUILD2_CMD"

docker-compose down --remove-orphans

docker-compose up -d

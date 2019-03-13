#!/usr/bin/env bash
set -e

BUILD_APP=$1
BUILD_CMD=$2

SECONDS=0 # start timer

echo "----------------------------------"
echo "Starting build of application $BUILD_APP"
echo "----------------------------------"

#build
echo "Launching group build command"
eval $BUILD_CMD

echo "Done build of application $BUILD_APP"
echo "SECONDS"
echo $SECONDS



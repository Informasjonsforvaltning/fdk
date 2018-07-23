#!/usr/bin/env bash

BUILD_APPS[0]="fuseki harvester harvester-api nginx-search nginx-registration reference-data registration-api registration-auth registration-validator search-api"
BUILD_CMD[0]="mvn install -Dmaven.javadoc.skip=true -B"

BUILD_APPS[1]="search"
BUILD_CMD[1]="( cd applications/search && ./travisBuild.sh )"

BUILD_APPS[2]="registration-react"
BUILD_CMD[2]="( cd applications/registration-react && ./travisBuild.sh )"

export BUILD_APPS
export BUILD_CMD

export INTEGRATION_APPS=${BUILD_APPS[@]}

#!/usr/bin/env bash

i=0
BUILD_APPS[$i]="search"
BUILD_CMD[$i]="( cd applications/search && ./travisBuild.sh )"

i=$((i+1))
BUILD_APPS[$i]="registration-react"
BUILD_CMD[$i]="( cd applications/registration-react && ./travisBuild.sh )"

maven_apps="fuseki harvester harvester-api nginx-search nginx-registration reference-data registration-api registration-auth search-api"

for maven_app in $maven_apps; do
    i=$((i+1))
    BUILD_APPS[$i]=$maven_app
    BUILD_CMD[$i]="mvn clean install -T 2C -pl applications/$maven_app -am"
done

export BUILD_APPS
export BUILD_CMD

#!/usr/bin/env bash

export BUILD1_APPS="fuseki harvester harvester-api nginx-search nginx-registration reference-data registration-react registration-api registration-auth registration-validator search-api"
export BUILD1_CMD="mvn install -Dmaven.javadoc.skip=true -B"

export BUILD2_APPS="search"
export BUILD2_CMD="( cd applications/search && ./travisBuild.sh )"

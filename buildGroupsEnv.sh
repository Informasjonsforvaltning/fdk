#!/usr/bin/env bash

export BUILD1_APPS="fuseki harvester harvester-api nginx-search nginx-registration reference-data registration-react registration-api registration-auth registration-validator search search-api"
export BUILD1_CMD="mvn install -DskipTests -Dmaven.javadoc.skip=true"

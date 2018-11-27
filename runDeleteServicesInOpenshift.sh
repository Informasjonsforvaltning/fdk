#!/usr/bin/env bash

# Script for deleting services in openshift
# oc login
#
# runDeleteServicesInOpenshift environment
# example:
# runDeleteServicesInOpenshift st1

environment=$1
profile=fellesdatakatalog-$environment
tag=latest

#midlertidig kommentert ut reference-data
services="registration-react reference-data registration-auth registration-api nginx-search nginx-registration harvester harvester-api api-cat search search-api"

for i in $services
do
    oc delete all -l app=$i -n $profile
done

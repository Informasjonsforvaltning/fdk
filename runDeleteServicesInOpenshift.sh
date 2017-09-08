#!/usr/bin/env bash

# Script for deleting services in openshift
# oc login
# oc projects xxxx

environment=st2
profile=fellesdatakatalog-$environment
tag=latest

#midlertidig kommentert ut reference-data

services="registration registration-auth registration-api registration-validator nginx gdoc harvester harvester-api search search-api"

for i in $services
do
    oc delete all -l app=$i
done

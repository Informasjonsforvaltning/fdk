#!/usr/bin/env bash

# Script for deleting services in openshift
# oc login
# oc projects xxxx

environment=st2
profile=fellesdatakatalog-$environment
tag=latest

services="registration registration-auth registration-api registration-validator reference-data nginx gdoc harvester harvester-api search search-api"

for i in $services
do
    oc delete all -l app=$i
done

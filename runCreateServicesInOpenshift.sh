#!/usr/bin/env bash

#Installation script for creating services on Openshift
# oc login
# oc projects xxxx

environment=st2
profile=fellesdatakatalog-$environment
tag=latest

services="registration registration-auth registration-api registration-validator reference-data nginx gdoc harvester harvester-api search search-api"

for i in $services
do
    oc new-app dcatno/$i:$tag
    oc expose dc/$i --port=8080
    oc env dc/$i SPRING_PROFILES_ACTIVE=$profile JVM_OPTIONS="-Xms128m -Xmx256m"
done
oc expose dc/registration --port=4200
oc env dc/registration REG_API_URL=https://reg-gui-fellesdatakatalog-st2.ose-npc.brreg.no/ QUERY_SERVICE_URL=https://reg-gui-fellesdatakatalog-st2.ose-npc.brreg.no/reference-data PORT=4200 NODE_ENV=st2

#expose routes for external services
externalservices="gdoc harvester harvester-api search search-api nginx"
for i in $externalservices
do
    oc expose svc/$i
done
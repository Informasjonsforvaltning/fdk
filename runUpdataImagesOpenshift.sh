#!/usr/bin/env bash

services="registration registration-auth registration-api registration-auth registration-validator reference-data search-api search harvester harvester-api nginx"

for i in $services
do
    docker push dcatno/$i:latest
done

for i in $services
do
    oc import-image dcatno/$i:latest
done


#oc import-image dcatno/registration:latest
#oc import-im
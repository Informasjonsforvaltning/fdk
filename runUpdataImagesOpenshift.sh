#!/usr/bin/env bash

services="registration-react registration-auth registration-api registration-auth reference-data search-api search api-cat harvester harvester-api nginx-registration nginx-search"

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
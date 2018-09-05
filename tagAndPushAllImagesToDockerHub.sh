#!/usr/bin/env bash

services="registration-react registration-auth registration-api registration-auth reference-data search-api search api-cat harvester harvester-api nginx-registration nginx-search"

for i in $services
do
    oc import-image dcatno/$i:ut2_latest
    #./tagAndPushLatestImage.sh $i ut2
done

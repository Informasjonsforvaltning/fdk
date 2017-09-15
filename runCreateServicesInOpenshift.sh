#!/usr/bin/env bash

#Installation script for creating services on Openshift
# log in first:
# oc login
#
# Parameters:
# runCreateServicesInOpenshift <environment> <date-tag>
#
# example:
# runCreateServicesInOpenshift st2 st2_2017-02-18

#todo: må environment-tag også være en parameter? Trenger vi den egentlig her?

environment=$1
dateTag=$2
environmentTag=$1_latest
profile=prod
tag=latest #todo: må justeres slik at det passer med Håvards script
host=$environment.ose-npc.brreg.no

if [ $environment = ppe ]
then
  host=ppe.brreg.no
fi

services="registration registration-auth registration-api registration-validator reference-data gdoc harvester harvester-api search search-api nginx"

oc project $profile

#todo må vi sette container port?
for i in $services
do
    oc new-app dcatno/$i:$tag
    oc expose dc/$i --port=8080
    oc env dc/$i SPRING_PROFILES_ACTIVE=$profile JVM_OPTIONS="-Xms128m -Xmx256m"
    oc label service $i environmentTag=$environmentTag --overwrite=true
    oc label dc $i environmentTag=$environmentTag --overwrite=true
    oc label service $i environmentDate=$dateTag --overwrite=true
    oc label dc $i environmentDate=$dateTag --overwrite=true
done
oc expose dc/registration --port=4200
oc env dc/registration REG_API_URL=https://reg-gui-fellesdatakatalog-$host QUERY_SERVICE_URL=https://reg-gui-fellesdatakatalog-$host/reference-data PORT=4200 NODE_ENV=$environment
oc env dc/search search_referenceDataExternalUrl=https://reference-data-fdk.$host search_queryServiceExternal=https://search-api-fdk.$host
oc env dc/harvester-api themesHttpUsername=themeUser themesHttpPassword=themePassword


#mount persistent storage volumes - midlertidig kommentert ut for reference-data, virker ikke i git bash
# oc volumes dc/reference-data --add --type=persistentVolumeClaim --claim-name=fdk-tdb --mount-path=/tdb

#expose external routes to services
externalservices="gdoc harvester harvester-api search search-api"
for i in $externalservices
do
    oc expose svc/$i
    oc label route $i environmentTag=$environmentTag --overwrite=true
    oc label route $i environmentDate=$dateTag --overwrite=true
done

##special route for registration gui
oc create route edge --service=nginx --hostname=reg-gui-fellesdatakatalog-$environment.ose-npc.brreg.no
oc label route nginx environmentTag=$environmentTag --overwrite=true
oc label route nginx environmentDate=$dateTag --overwrite=true



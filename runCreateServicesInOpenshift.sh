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
profile=fellesdatakatalog-$environment
tag=latest #todo: må justeres slik at det passer med Håvards script


#configuration that differs between nonprod and prod clusters
if [$environment == 'ppe'] || [$environment == 'prd']
then
    #run on prod cluster
    cluster=ose-pc
else
    #run on non-prod cluster if environment is ut1, st1, st2, tt1
    cluster=ose-npc
fi


#configuration that differs between prod and all other (non-prod) environments
if [$environment == 'prd']
then
    #special config for prod environment
else
    #special config for non-prod environments, including preprod: ut1, st1, st2, tt1, ppe
    altinnServiceCode=4814
    altinnServiceEdition=3
    altinnServiceUrl=https://tt02.altinn.no/
    altinnApiKey=948E57B8-8F44-43E6-921F-F512F67A7F76
    sslKeystoreLocation=conf/idporten/ssldevelop.p12
fi


#midlertidig kommentert ut reference-data
services="registration registration-auth registration-api registration-validator gdoc harvester harvester-api search search-api nginx"

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


# special configuration for registration service
oc expose dc/registration --port=4200
oc env dc/registration REG_API_URL=https://reg-gui-fellesdatakatalog-$environment.$cluster.brreg.no/ QUERY_SERVICE_URL=https://reg-gui-fellesdatakatalog-$environment.$cluster.brreg.no/reference-data PORT=4200 NODE_ENV=$environment


# special configuration for registration-api service
oc env dc/registration-api SPRING_PROFILES_ACTIVE=prod
oc env dc/registration-api registrationApi_IncludeServerPortInRequestUrl=false
oc env dc/registration-api registrationApi_OpenshiftEnvironment=$environment
oc env dc/registration-api registrationApi_ServerName=reg-gui-fellesdatakatalog-$environment.$cluster.brreg.no
oc env dc/registration-api registrationApi_altinnServiceCode=$altinnServiceCode
oc env dc/registration-api registrationApi_altinnServiceEdition=$altinnServiceEdition
oc env dc/registration-api registrationApi_altinnServiceUrl=$altinnServiceUrl
oc env dc/registration-api registrationApi_apikey=$altinnApiKey
oc env dc/registration-api registrationApi_clientSSLCertificateKeystoreLocation="conf/altinn/Buypass ID-REGISTERENHETEN I BROENNOEYSUND-serienummer1544700822686643554309384-2017-05-31.p12"
oc env dc/registration-api registrationApi_clientSSLCertificateKeystorePassword=changeit
oc env dc/registration-api registrationApi_ipKeyPassword=changeit
oc env dc/registration-api registrationApi_ipStorePassword=changeit
oc env dc/registration-api registrationApi_sslKeyPassword=changeit
oc env dc/registration-api registrationApi_sslKeystoreLocation=$sslKeystoreLocation


# special configuration for search service
oc env dc/search APPLICATION_QUERYSERVICEEXTERNAL=https://search-api-fellesdatakatalog-$environment.$cluster.brreg.no

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
oc create route edge --service=nginx --hostname=reg-gui-fellesdatakatalog-$environment.$cluster.brreg.no
oc label route nginx environmentTag=$environmentTag --overwrite=true
oc label route nginx environmentDate=$dateTag --overwrite=true

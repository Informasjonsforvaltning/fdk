#!/usr/bin/env bash

#Installation script for creating a single service on Openshift
# log in first:
# oc login
#
# Parameters:
# runCreateServiceInOpenshift <service> <environment> <date-tag>
#
# example:
# runCreateServiceInOpenshift registration-api st2 st2_2017-02-18

#todo: må environment-tag også være en parameter? Trenger vi den egentlig her?

# some input validation
if [ -z "$1" ]
then
    echo service must be specified: search, registration, search-api etc...
    exit 1
fi

if [ -z "$2" ]
then
    echo environment must be specified: ut1, st1, st2, tt1 ppe or prd
    exit 1
fi

if [ -z "$3" ]
then
    echo Environment date tag must be supplied. Example: ST1_2017-09-13
    exit 1
fi


service=$1
environment=$2
dateTag=$3
environmentTag=$2_latest
profile=prod
openshiftProject=fellesdatakatalog-$environment
tag=latest #todo: må justeres slik at det passer med Håvards script


#configuration that differs between nonprod and prod clusters
if [ $environment = ppe ] || [ $environment = prd ]
then
    #run on prod cluster
    cluster=ose-pc

    #point to Altinn prod environment
    altinnServiceCode=4814
    altinnServiceEdition=1
    altinnServiceUrl=https://altinn.no/ #todo: denne blir ny. Oppdater når vi får riktig verdi
    altinnApiKey=F1136D29-73EF-4A1B-AE08-BC4D537507BA
    sslKeystoreLocation=conf/idporten/ssldevelop.p12
else
    #run on non-prod cluster if environment is ut1, st1, st2, tt1
    cluster=ose-npc

    #point to Altinn test environnment
    altinnServiceCode=4814
    altinnServiceEdition=3
    altinnServiceUrl=https://tt02.altinn.no/
    altinnApiKey=948E57B8-8F44-43E6-921F-F512F67A7F76
    sslKeystoreLocation=conf/idporten/ssldevelop.p12
fi

host=$environment.$cluster.brreg.no


# configuration that is specific for preprod environment
if [ $environment = ppe ]
then
  host=ppe.brreg.no
fi


#configuration that differs between prod and other environments
if [ $environment = prd ]
then
    #configuration for prod environment

    #prod cetificate
    clientCertificateKeystoreLocation="conf/altinn/todo"
else
    #configuration for all other environments including preprod: ut1, st1, st2, tt1, ppe

    #test cetificate
    clientCertificateKeystoreLocation="conf/altinn/Buypass ID-REGISTERENHETEN I BROENNOEYSUND-serienummer1544700822686643554309384-2017-05-31.p12"
fi


#Deploy to correct environment
oc project $openshiftProject


# create the actual services

if [ $service = elasticsearch ]
then
    # todo
    echo Elasticsearch deploy not implemented yet

if [ $service = fuseki ]
then
    # todo
    echo Fuseki deploy not implemented yet

if [ $service = registration ]
then
    createOpenshiftService registration
    oc expose dc/registration --port=4200
    oc env dc/registration REG_API_URL=https://reg-gui-fellesdatakatalog-$environment.$cluster.brreg.no/ QUERY_SERVICE_URL=https://reg-gui-fellesdatakatalog-$environment.$cluster.brreg.no/reference-data PORT=4200 NODE_ENV=$environment

elif [ $service = reference-data ]
then
    # todo midlertidig kommentert ut pga at oppretting av volum ikke virker
    #createOpenshiftService reference-data
    # todo generate password for reference-data
    #oc env dc/reference-data themesHttpUsername=themeUser themesHttpPassword=themePassword

    #mount persistent storage volumes - midlertidig kommentert ut for reference-data, virker ikke i git bash
    # oc volumes dc/reference-data --add --type=persistentVolumeClaim --claim-name=fdk-tdb --mount-path=/tdb

elif [ $service = registration-auth ]
then
    createOpenshiftService registration-auth

elif [ $service = registration-validator ]
then
    createOpenshiftService registration-validator

elif [ $service = harvester-api ]
then
    createOpenshiftService harvester-api
    oc env dc/harvester-api themesHttpUsername=themeUser themesHttpPassword=themePassword
    exposeService harvester-api

elif [ $service = registration-api ]
then
    createOpenshiftService registration-api
    oc env dc/registration-api SPRING_PROFILES_ACTIVE=$profile
    oc env dc/registration-api registrationApi_IncludeServerPortInRequestUrl=false
    oc env dc/registration-api registrationApi_OpenshiftEnvironment=$environment
    oc env dc/registration-api registrationApi_ServerName=reg-gui-fellesdatakatalog-$environment.$cluster.brreg.no
    oc env dc/registration-api registrationApi_altinnServiceCode=$altinnServiceCode
    oc env dc/registration-api registrationApi_altinnServiceEdition=$altinnServiceEdition
    oc env dc/registration-api registrationApi_altinnServiceUrl=$altinnServiceUrl
    oc env dc/registration-api registrationApi_apikey=$altinnApiKey
    oc env dc/registration-api registrationApi_clientSSLCertificateKeystoreLocation="$clientCertificateKeystoreLocation"
    oc env dc/registration-api registrationApi_clientSSLCertificateKeystorePassword=changeit
    oc env dc/registration-api registrationApi_ipKeyPassword=changeit
    oc env dc/registration-api registrationApi_ipStorePassword=changeit
    oc env dc/registration-api registrationApi_sslKeyPassword=changeit
    oc env dc/registration-api registrationApi_sslKeystoreLocation=$sslKeystoreLocation

    echo "Registration-api: Keystore password environment variables must be set manually"
    echo "Registration-api: Remember to mound /conf volume"

    # kommando for å mounte conf-katalog. Bør automatiseres etter hvert...
    # oc rsync conf/ registration-api-5-z2pq7:/conf


elif [ $service = search ]
then
    createOpenshiftService search
    oc env dc/search search_referenceDataExternalUrl=https://reference-data-fdk.$host search_queryServiceExternal=https://search-api-fdk.$host
    exposeService search

elif [ $service = gdoc ]
then
    createOpenshiftService gdoc
    exposeService gdoc

elif [ $service = harvester ]
then
    createOpenshiftService gdoc
    exposeService harvester

elif [ $service = search-api ]
then
    createOpenshiftService search-api
    exposeService search-api

elif [ $service = nginx ]
then
    createOpenshiftService nginx

    #create secure route for registration gui
    oc create route edge --service=nginx --hostname=reg-gui-fellesdatakatalog-$environment.$cluster.brreg.no
    oc label route nginx environmentTag=$environmentTag --overwrite=true
    oc label route nginx environmentDate=$dateTag --overwrite=true
fi

echo "Done"


function createOpenshiftService {
    osService=$1
    #todo må vi sette container port?
    oc new-app dcatno/$osService:$tag
    oc expose dc/$osService --port=8080
    oc env dc/$osService SPRING_PROFILES_ACTIVE=$profile JVM_OPTIONS="-Xms128m -Xmx256m"
    oc label service $osService environmentTag=$environmentTag --overwrite=true
    oc label dc $osService environmentTag=$environmentTag --overwrite=true
    oc label service $osService environmentDate=$dateTag --overwrite=true
    oc label dc $osService environmentDate=$dateTag --overwrite=true

}

function exposeService {
    serviceName=$1
    oc expose svc/$serviceName
    oc label route $serviceName environmentTag=$environmentTag --overwrite=true
    oc label route $serviceName environmentDate=$dateTag --overwrite=true
}

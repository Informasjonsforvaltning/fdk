#!/usr/bin/env bash

#Installation script for creating a single service on Openshift
# log in first:
# oc login
#
# Parameters:
# runCreateServiceInOpenshift <service> <environment> <dockertag> <date-tag> <deploymode>
#
# Deploymode parameter:
# - recreateServices : Deletes and recreates all services and routes, deploys new images
# - onlyDeployImages : Only deploy new images
#
# example:
# runCreateServiceInOpenshift registration-api st2 latest st2_2017-02-18 recreateServices

function createOpenshiftService {
    osService=$1

    oc new-app dcatno/$osService:$tag
    oc expose dc/$osService --port=8080
    oc env dc/$osService SPRING_PROFILES_ACTIVE=$profile JVM_OPTIONS="-Xms128m -Xmx256m"
    oc label service $osService --overwrite=true \
        environmentTag=$environmentTag \
        environmentDate=$dateTag
    oc label dc $osService --overwrite=true \
        environmentTag=$environmentTag \
        environmentDate=$dateTag

    #tag the image stream to auto-pull new images from docker hub
    oc tag --scheduled=true docker.io/dcatno/$osService:$tag $osService:$tag
}

function deployNewDockerImage {
    osService=$1

    oc import-image dcatno/$osService:$tag

    oc label service $osService --overwrite=true \
        environmentTag=$environmentTag \
        environmentDate=$dateTag
    oc label dc $osService --overwrite=true \
        environmentTag=$environmentTag \
        environmentDate=$dateTag

}

function exposeService {
    serviceName=$1
    oc expose svc/$serviceName
    oc label route $serviceName --overwrite=true \
        environmentTag=$environmentTag \
        environmentDate=$dateTag
}


# some input validation
if [ -z "$1" ]
then
    echo "service must be specified: search, registration, search-api etc..."
    echo "correct usage: runCreateServiceInOpenshift.sh <service> <environment> <dockertag> <date-tag> <deploymode>"
    exit 1
fi

if [ -z "$2" ]
then
    echo "environment must be specified: ut1, st1, st2, tt1 ppe, pp2 or prd"
    echo "correct usage: runCreateServiceInOpenshift.sh <service> <environment> <dockertag> <date-tag> <deploymode>"
    exit 1
fi

if [ -z "$3" ]
then
    echo "docker  tag must be supplied. Example: latest"
    echo "correct usage: runCreateServiceInOpenshift.sh <service> <environment> <dockertag> <date-tag> <deploymode>"
    exit 1
fi

if [ -z "$4" ]
then
    echo "Environment date tag must be supplied. Example: ST1_2017-09-13"
    echo "correct usage: runCreateServiceInOpenshift.sh <service> <environment> <dockertag>  <date-tag> <deploymode>"
    exit 1
fi

if [ -z "$5" ]
then
    echo "Deployment mode must be specified. { onlyDeployImages | recreateServices }"
    echo " Deploymode parameter:"
    echo " - recreateServices : Deletes and recreates all services and routes, deploys new images"
    echo " - onlyDeployImages : Only deploy new images"
    echo "correct usage: runCreateServiceInOpenshift.sh <service> <environment> <dockertag>  <date-tag> <deploymode>"
    exit 1
fi

service=$1
environment=$2
tag=$3
dateTag=$4
deploymode=$5
environmentTag=$2_latest
openshiftProject=fellesdatakatalog-$environment


#configuration that differs between nonprod and prod clusters
if [ $environment = ppe ] || [ $environment = pp2 ]|| [ $environment = prd ]
then
    #run on prod cluster
    cluster=paas
else
    #run on non-prod cluster if environment is ut1, st1, st2, tt1, pp2
    cluster=paas-nprd
fi

#configuration - ppe and prd environmens should use Altinn and Idporten prod environment
# others, including pp2 use test environments
# Remark: Files in conf/ directory must be copied manually into the environment
# as they cannot be stored in the public github repository
if [ $environment = ppe ] || [ $environment = prd ]
then
    #point to Altinn prod environment
    altinnServiceCode=4814
    altinnServiceEdition=1
    altinnServiceUrl=https://altinn.no/
    altinnApiKey=F1136D29-73EF-4A1B-AE08-BC4D537507BA
    sslKeystoreLocation=conf/idporten/ssldevelop.p12
    clientCertificateKeystoreLocation="conf/altinn/Buypass ID-REGISTERENHETEN-I-BRONNOYSUND-serienummer13439118435479952733750626-2017-05-10.p12"
    registrationApiIdportenMetadatafile="conf/idporten/idporten.difi.no-v3-prod-meta_sign.xml"

    registrationApiHarvesterUserName=changeme
    registrationApiHarvesterPassword=changeme
else

    registrationGuiExternalAddress=reg-gui-new-fellesdatakatalog-$environment.$cluster.brreg.no
    searchGuiExternalAddress=fellesdatakatalog-$environment.$cluster.brreg.no

    #point to Altinn test environnment
    altinnServiceCode=4814
    altinnServiceEdition=3
    altinnServiceUrl=https://tt02.altinn.no/
    altinnApiKey=948E57B8-8F44-43E6-921F-F512F67A7F76
    sslKeystoreLocation=conf/idporten/ssldevelop.p12
    clientCertificateKeystoreLocation="conf/altinn/Buypass ID-REGISTERENHETEN I BROENNOEYSUND-serienummer1544700822686643554309384-2017-05-31.p12"
    registrationApiIdportenMetadatafile="conf/idporten/idporten-ver2.difi.no-v3_signed_meta.xml"

    registrationApiHarvesterUserName=changeme
    registrationApiHarvesterPassword=changeme
fi

host=$environment.$cluster.brreg.no


# configuration that is specific for preprod environment
if [ $environment = ppe ]
then
  host=ppe.brreg.no
  registrationGuiExternalAddress=registrering-fdk.$host
  searchGuiExternalAddress=fellesdatakatalog.$host
fi

# configuration that is specific for externally accessible test environment
if [ $environment = tt1 ]
then
  host=tt1.brreg.no
  registrationGuiExternalAddress=registrering-fdk.$host
  searchGuiExternalAddress=fellesdatakatalog.$host
fi


#Deploy to correct environment
oc project $openshiftProject



# create the actual services

if [ $service = elasticsearch ]
then
    # todo
    echo Elasticsearch deploy not implemented yet

elif [ $service = fuseki ]
then
    # todo
    echo Fuseki deploy not implemented yet

elif [ $service = elasticsearch-copy ]
then
    if [ $deploymode = recreateServices ]
    then
        profile=prod
        createOpenshiftService elasticsearch-copy
    else
        # deploymentmode = onlyDeployImages
        deployNewDockerImage elasticsearch-copy
    fi


elif [ $service = registration-react ]
then
    if [ $deploymode = recreateServices ]
    then
        profile=prod
        createOpenshiftService registration-react
        oc expose dc/registration-react --port=4300

        if [ $environment = ppe ]
        then
            oc env dc/registration-react REG_API_URL=https://$registrationGuiExternalAddress/ \
            PORT=4300 \
            NODE_ENV=production

        elif [ $environment = tt1 ]
        then
            oc env dc/registration-react REG_API_URL=https://$registrationGuiExternalAddress/ \
            PORT=4300 \
            NODE_ENV=production

        else
            oc env dc/registration-react REG_API_URL=https://reg-gui-new-fellesdatakatalog-$environment.$cluster.brreg.no/ \
            PORT=4300 \
            NODE_ENV=production
        fi
    else
        # deploymentmode = onlyDeployImages
        deployNewDockerImage registration-react
    fi

elif [ $service = reference-data ]
then
    if [ $deploymode = recreateServices ]
    then
        profile=prod

        createOpenshiftService reference-data

        # todo generate password for reference-data
        oc env dc/reference-data themesHttpUsername=themeUser themesHttpPassword=themePassword

        #mount persistent storage volumes - midlertidig kommentert ut for reference-data, virker ikke i git bash
        #oc volumes dc/reference-data --add --type=persistentVolumeClaim --claim-name=fdk-tdb --mount-path=/tdb
        echo Remember to mount /tdb volume manually

        #create secure route for reference-data
        oc create route edge --service=reference-data --hostname=reference-data-fellesdatakatalog-$environment.$cluster.brreg.no
        oc label route reference-data --overwrite=true \
            environmentTag=$environmentTag \
            environmentDate=$dateTag
    else
        # deploymentmode = onlyDeployImages
        deployNewDockerImage reference-data
    fi


elif [ $service = registration-auth ]
then
    if [ $deploymode = recreateServices ]
    then
        profile=prod
        createOpenshiftService registration-auth
    else
        # deploymentmode = onlyDeployImages
        deployNewDockerImage registration-auth
    fi

elif [ $service = harvester-api ]
then
    if [ $deploymode = recreateServices ]
    then
        profile=prod
        createOpenshiftService harvester-api
        oc env dc/harvester-api \
        themesHttpUsername=themeUser \
        themesHttpPassword=themePassword \
        emailUsername=changeme \
        emailPassword=changeme \
        emailSenderAddress=changeThe@email.address.here \
        FDK_ES_CLUSTERNODES=es01-fdk-01-${environment}.regsys-nprd.brreg.no:9300 \
        FDK_ES_CLUSTERNAME=es01-fdk-${environment}

        exposeService harvester-api
    else
        # deploymentmode = onlyDeployImages
        deployNewDockerImage harvester-api
    fi

elif [ $service = registration-api ]
then
    if [ $deploymode = recreateServices ]
    then
        # spring boot profiles:
        # prod if authenticating with idporten
        # prod-localauth if using local authentication and authorization
        if [ $environment = ut1 ] || [ $environment = st2 ] || [ $environment = tt1 ] || [ $environment = pp2 ]
        then
            profile=prod-localauth
            altinnServiceUrl=http://registration-auth:8080/
        else
            profile=prod
        fi

        createOpenshiftService registration-api
        oc env dc/registration-api \
            SPRING_PROFILES_ACTIVE=$profile \
            registrationApi_IncludeServerPortInRequestUrl=false \
            registrationApi_OpenshiftEnvironment=$environment \
            registrationApi_ServerName=$registrationGuiExternalAddress \
            registrationApi_altinnServiceCode=$altinnServiceCode \
            registrationApi_altinnServiceEdition=$altinnServiceEdition \
            registrationApi_altinnServiceUrl=$altinnServiceUrl \
            registrationApi_apikey=$altinnApiKey \
            registrationApi_clientSSLCertificateKeystoreLocation="$clientCertificateKeystoreLocation" \
            registrationApi_clientSSLCertificateKeystorePassword=changeit \
            registrationApi_ipKeyPassword=changeit \
            registrationApi_ipStorePassword=changeit \
            registrationApi_sslKeyPassword=changeit \
            registrationApi_sslKeystoreLocation=$sslKeystoreLocation \
            registrationApi_idportenMetadataFile=$registrationApiIdportenMetadatafile \
            registrationApi_harvesterUsername=$registrationApiHarvesterUserName \
            registrationApi_harvesterPassword=$registrationApiHarvesterPassword \
            FDK_ES_CLUSTERNODES=es01-fdk-01-${environment}.regsys-nprd.brreg.no:9300 \
            FDK_ES_CLUSTERNAME=es01-fdk-${environment}

        echo "Registration-api: Keystore password environment variables must be set manually"
        echo "Registration-api: Remember to mount /conf volume"

        # todo: kommando for å mounte conf-katalog må inn. Samme problem som for reference-data.
        # Hvis innhold på conf skal frornyes: (stå i katalog conf) oc rsync . registration-api-5-z2pq7:/conf
    else
        # deploymentmode = onlyDeployImages
        deployNewDockerImage registration-api
    fi

elif [ $service = search ]
then
    if [ $deploymode = recreateServices ]
    then
        profile=prod
        createOpenshiftService search
        oc env dc/search NODE_ENV=production
        exposeService search
        oc expose dc/search --port=3000
    else
        # deploymentmode = onlyDeployImages
        deployNewDockerImage search
    fi

elif [ $service = harvester ]
then
    if [ $deploymode = recreateServices ]
    then
        profile=prod
        createOpenshiftService harvester

        oc env dc/harvester \
            harvester_adminUsername=test_admin \
            harvester_adminPassword=password

        exposeService harvester
    else
        # deploymentmode = onlyDeployImages
        deployNewDockerImage harvester
    fi

elif [ $service = search-api ]
then
    if [ $deploymode = recreateServices ]
    then
        profile=prod
        createOpenshiftService search-api

        #create secure route for search api
        oc create route edge --service=search-api --hostname=search-api-fellesdatakatalog-$environment.$cluster.brreg.no
        oc label route search-api --overwrite=true \
            environmentTag=$environmentTag \
            environmentDate=$dateTag \
            FDK_ES_CLUSTERNODES=es01-fdk-01-${environment}.regsys-nprd.brreg.no:9300 \
            FDK_ES_CLUSTERNAME=es01-fdk-${environment}
    else
        # deploymentmode = onlyDeployImages
        deployNewDockerImage search-api
    fi

elif [ $service = api-cat ]
then
    if [ $deploymode = recreateServices ]
    then
        profile=prod
        createOpenshiftService api-cat

        #create secure route for search api
        oc create route edge --service=api-cat --hostname=api-cat-fellesdatakatalog-$environment.$cluster.brreg.no
        oc label route api-cat --overwrite=true \
            environmentTag=$environmentTag \
            environmentDate=$dateTag
    else
        # deploymentmode = onlyDeployImages
        deployNewDockerImage api-cat
    fi

elif [ $service = nginx-registration ]
then
    if [ $deploymode = recreateServices ]
    then
        profile=prod
        createOpenshiftService nginx-registration

        #create secure route for registration gui
        oc create route edge --service=nginx-registration --hostname=$registrationGuiExternalAddress --port=8080
        oc label route nginx-registration --overwrite=true \
            environmentTag=$environmentTag \
            nginx environmentDate=$dateTag

        #todo: should be automated
        echo "Remember: Container port 80 must be deleted in service"
    else
        # deploymentmode = onlyDeployImages
        deployNewDockerImage nginx-registration
    fi

elif [ $service = nginx-search ]
then
    if [ $deploymode = recreateServices ]
    then
        profile=prod
        createOpenshiftService nginx-search

        #create route for registration gui
        oc create route edge --service=nginx-search --hostname=$searchGuiExternalAddress --port=8080
        oc label route nginx-search --overwrite=true \
            environmentTag=$environmentTag \
            environmentDate=$dateTag

        #todo: should be automated
        echo "Remember: Container port 80 must be deleted in service"

    else
        # deploymentmode = onlyDeployImages
        deployNewDockerImage nginx-search
    fi

else
    echo "Error: unknown service name: $service"
fi

echo "Done"


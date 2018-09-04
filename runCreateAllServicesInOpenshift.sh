#!/usr/bin/env bash

#Installation script for creating all dcat services on Openshift
# log in first:
# oc login
#
# Parameters:
# runCreateAllServicesInOpenshift <environment> <dockertag> <date-tag> <deploymentmode>
#
# example:
# runCreateAllServicesInOpenshift st2 latest st2_2017-02-18 onlyDeployImages

#todo: må environment-tag også være en parameter? Trenger vi den egentlig her?

# some input validation
if [ -z "$1" ]
then
    echo "environment must be specified: ut1, st1, st2, tt1 ppe or prd"
    echo "correct usage: runCreateAllServicesInOpenshift.sh <environment> <dockertag> v<date-tag>"
    exit 1
fi

if [ -z "$2" ]
then
    echo "Docker tag must be supplied. Example: latest"
    echo "correct usage: runCreateAllServicesInOpenshift.sh <environment> <dockertag> <date-tag>"
    exit 1
fi


if [ -z "$3" ]
then
    echo "Environment date tag must be supplied. Example: ST1_2017-09-13"
    echo "correct usage: runCreateAllServicesInOpenshift.sh <environment> <dockertag> <date-tag>"
    exit 1
fi

if [ -z "$4" ]
then
    echo "Deployment mode must be specified. { onlyDeployImages | recreateServices }"
    echo " Deploymode parameter:"
    echo " - recreateServices : Deletes and recreates all services and routes, deploys new images"
    echo " - onlyDeployImages : Only deploy new images"
    echo "correct usage: runCreateAllServicesInOpenshift.sh <environment> <dockertag>  <date-tag> <deploymode>"
    exit 1
fi


environment=$1
tag=$2
dateTag=$3
deploymentmode=$4


services="elasticsearch elasticsearch-copy fuseki reference-data registration-react registration-auth registration-api harvester harvester-api search api-cat search-api nginx-registration nginx-search"

for i in $services
do
    sh runCreateServiceInOpenshift.sh $i $environment $tag $dateTag $deploymentmode
done

echo "Done"
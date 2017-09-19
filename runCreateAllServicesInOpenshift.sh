#!/usr/bin/env bash

#Installation script for creating all dcat services on Openshift
# log in first:
# oc login
#
# Parameters:
# runCreateAllServicesInOpenshift <environment> <date-tag>
#
# example:
# runCreateAllServicesInOpenshift st2 st2_2017-02-18

#todo: må environment-tag også være en parameter? Trenger vi den egentlig her?

# some input validation
if [ -z "$1" ]
then
    echo environment must be specified: ut1, st1, st2, tt1 ppe or prd
    exit 1
fi

if [ -z "$2" ]
then
    echo Environment date tag must be supplied. Example: ST1_2017-09-13
    exit 1
fi


environment=$1
dateTag=$2
tag=latest #todo: må justeres slik at det passer med Håvards script



#midlertidig kommentert ut reference-data
services="elasticsarch fuseki registration registration-auth registration-api registration-validator gdoc harvester harvester-api search search-api nginx"

for i in $services
do
    sh runCreateServiceInOpenshift.sh $i $environment $dateTag
done

echo "Done"
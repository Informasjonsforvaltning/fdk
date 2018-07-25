#!/usr/bin/env bash
set -e

# Dumps dcat and harvest index from elasticsearch to file
# requires: npm install elasticdump@2.1.0 -g

function startDump {
    echo "Start"

    environment=$1
    sourceElasticUrl=http://elasticsearch-fellesdatakatalog-${environment}.paas-nprd.brreg.no
    if [ "$environment" == "ppe" ]
    then
        sourceElasticUrl=http://elasticsearch-fellesdatakatalog-${environment}.paas.brreg.no
    fi

    DATETIME=`date "+%Y-%m-%dT%H_%M_%S"`

    echo "Starting dump ${DATETIME}"

    # dump source
    echo "Dumping dcat "
    elasticdump --input=${sourceElasticUrl}/dcat --output=${environment}_dcat.json --type=data

    echo "Dumping harvest/lookup"
    elasticdump --input=${sourceElasticUrl}/harvest/lookup --output=${environment}_harvest_lookup.json --type=data

    echo "Dumping harvest/catalog"
    elasticdump --input=${sourceElasticUrl}/harvest/catalog --output=${environment}_harvest_catalog.json --type=data

    echo "Dumping harvest/dataset"
    elasticdump --input=${sourceElasticUrl}/harvest/dataset --output=${environment}_harvest_dataset.json --type=data

    ENDTIME=`date "+%Y-%m-%dT%H_%M_%S"`
    echo "finished dump ${ENDTIME}"

}


if [ -z "$1" ]
then
    echo "environment must be specified: ut1, st1, st2, tt1 ppe or prd"
    echo "correct usage: dumpEnv.sh <environment>"
    exit 1
fi

echo "This will dump elasticsearch content of indexes dcat and harvest from $1 to file"
read -r -p "Are you sure? [y/N] " response

if [[ "$response" =~ ^([yY][eE][sS]|[yY])+$ ]]
then
    startDump $1
else
    exit 1
fi


echo "Done";

#!/usr/bin/env bash
set -e

# Dumps indexes from elasticsearch to file
# requires: npm install elasticdump@2.1.0 -g

function startDump {
    echo "Start"

    environment=$1
    sourceElasticUrl=https://elasticsearch-fellesdatakatalog-${environment}.paas-nprd.brreg.no

    if [ "$environment" == "ppe" ]
    then
        sourceElasticUrl=https://elasticsearch-fellesdatakatalog-${environment}.paas.brreg.no
    fi

    DATETIME=`date "+%Y-%m-%dT%H_%M_%S"`

    echo "Starting dump ${DATETIME}"

    indexes="dcat scat register acat"

    # dump indexes
    for i in ${indexes} ;
    do
        echo "******************"
        echo "Dumping ${i} "
        echo "******************"
        elasticdump --bulk=true --input=${sourceElasticUrl}/${i} --output=${environment}_${i}.json --type=data
    done

    ENDTIME=`date "+%Y-%m-%dT%H_%M_%S"`
    echo "Finished dump ${ENDTIME}"
}


if [ -z "$1" ]
then
    echo "Elasticsearch environment must be specified: ut1, st1, st2, tt1 ppe or prd"
    echo "correct usage: dumpEnv.sh <environment>"
    exit 1
fi

echo "This will dump elasticsearch content of indexes from $1 to file"
read -r -p "Are you sure? [y/N] " response

if [[ "$response" =~ ^([yY][eE][sS]|[yY])+$ ]]
then
    startDump $1
else
    exit 1
fi


echo "Done";

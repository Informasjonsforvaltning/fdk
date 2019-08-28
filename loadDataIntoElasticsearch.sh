#!/usr/bin/env bash
set -e

function startLoad {
    echo "Start loading data into elasticsearch ..."
    source=$1
    environment=$2

    targetElasticUrl=http://es01-fdk-01-${environment}.regsys-nprd.brreg.no:9200
    #targetElasticUrl=http://localhost:9200 #http://es01-fdk-01-${environment}.regsys-nprd.brreg.no:9200/
    # targetElasticUrl=https://elasticsearch-fellesdatakatalog-${environment}.paas-nprd.brreg.no
    if [ "$environment" == "ppe" ]
    then
        targetElasticUrl=https://elasticsearch-fellesdatakatalog-${environment}.paas.brreg.no
    fi

    if [ "$environment" == "ppe5" ]
    then
        targetElasticUrl=http://es01-fdk-01-prd.regsys-prd.brreg.no:9200
    fi

    if [ "$environment" == "localhost" ]
    then
        targetElasticUrl=http://localhost:9200
    fi

    if [ "$environment" == "st1" ] || [ "$environment" == "st2" ]
    then
        targetElasticUrl=http://es01-fdk-02-${environment}.regsys-nprd.brreg.no:9200
    fi

    echo "Source files to load            : ${source}"
    echo "Target elasticsearch environment: ${targetElasticUrl}"

    DATETIME=`date "+%Y-%m-%dT%H_%M_%S"`

    echo "Starting dump ${DATETIME}"

    dcatSetting=`cat libraries/datastore/src/main/resources/dcat_settings.json`


    loadDcat
    loadScat
    loadRegister
    loadHarvest

    ENDTIME=`date "+%Y-%m-%dT%H_%M_%S"`

    echo "finished dump ${ENDTIME}"
}

function loadHarvest {

    echo "******************"
    echo "HARVEST"
    echo "******************"

    curl -XDELETE ${targetElasticUrl}/harvest

    # skip first and last line in mappings
    harvestCatMapping=`sed '1d;$d' libraries/datastore/src/main/resources/harvest_catalog_mapping.json`
    harvestDatMapping=`sed '1d;$d' libraries/datastore/src/main/resources/harvest_dataset_mapping.json`
    harvestLooMapping=`sed '1d;$d' libraries/datastore/src/main/resources/harvest_lookup_mapping.json`

    harvestMetadata="{ \"settings\": ${dcatSetting}, \"mappings\": { ${harvestCatMapping}, ${harvestDatMapping}, ${harvestLooMapping} } }"

    curl -XPUT ${targetElasticUrl}/harvest -d "$harvestMetadata}"
    elasticdump --bulk=true --input=${source}_harvest.json --output=${targetElasticUrl}/harvest --type=data

}


function loadRegister {
    echo "******************"
    echo "REGISTER"
    echo "******************"


    curl -XDELETE ${targetElasticUrl}/register

    elasticdump --bulk=true --input=${source}_register.json --output=${targetElasticUrl}/register --type=data

}


function loadScat {
    echo "******************"
    echo "SCAT"
    echo "******************"

    curl -XDELETE ${targetElasticUrl}/scat

    scatMapping=`cat libraries/datastore/src/main/resources/scat_subject_mapping.json`
    scatMetadata="{ \"settings\": ${dcatSetting}, \"mappings\": ${scatMapping} }"

    curl -XPUT ${targetElasticUrl}/scat -d "${scatMetadata}"
    elasticdump --bulk=true --input=${source}_scat.json --output=${targetElasticUrl}/scat --type=data

}

function loadDcat {
    echo "******************"
    echo "DCAT"
    echo "******************"

    echo -e "Delete dcat index: \n\t curl -XDELETE ${targetElasticUrl}/dcat"
    curl -XDELETE ${targetElasticUrl}/dcat

    echo -e "\nCreate index with mapping"

    dcatMapping=`cat libraries/datastore/src/main/resources/dcat_dataset_mapping.json`
    dcatMetadata="{ \"settings\": ${dcatSetting}, \"mappings\": ${dcatMapping} }"

    curl -XPUT ${targetElasticUrl}/dcat -d "${dcatMetadata}"

    # recreate data in target environment
    echo -e "\nDump data into target environment"
    elasticdump --bulk=true --input=${source}_dcat.json --output=${targetElasticUrl}/dcat --type=data
}

if [ -z "$1" -o -z "$2" ]
then
    echo "This command loads data from previously dumped elasticsearch json-files into a target elasticsearch environment"
    echo "Source files and target environment must be specified: ut1, st1, st2, tt1 ppe or prd"
    echo "Example: loadDcatEnv.sh st2 localhost"
    echo "    will load content of st2_*.json files into environment elastic at localhost"
    exit 1
fi

echo "This will delete elasticsearch index <dcat, scat, harvest and register> in $2 and attempt to load previously dumped index in $1 into elasticsearch"
read -r -p "Are you sure? [y/N] " response

if [[ "$response" =~ ^([yY][eE][sS]|[yY])+$ ]]
then
    startLoad $1 $2
else
    exit 1
fi

echo "Done";

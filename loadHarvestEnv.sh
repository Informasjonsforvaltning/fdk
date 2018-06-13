#!/usr/bin/env bash
set -e


function startLoad {
    echo "Start loading ..."
    environment=$1
    targetElasticUrl=http://elasticsearch-fellesdatakatalog-${environment}.paas-nprd.brreg.no
    if [ "$environment" == "ppe" ]
    then
        targetElasticUrl=http://elasticsearch-fellesdatakatalog-${environment}.paas.brreg.no
    fi
    echo $targetElasticUrl

    DATETIME=`date "+%Y-%m-%dT%H_%M_%S"`

    echo "Starting dump ${DATETIME}"

    # prepare target environment
    echo "Delete harvest index"
    curl -XDELETE ${targetElasticUrl}/harvest

    echo "Create index with mapping"

    curl -XPOST ${targetElasticUrl}/harvest -d '{
        "settings": {
            "analysis": {
                "analyzer": {
                    "path-analyzer": {
                        "type": "custom",
                        "tokenizer": "path-tokenizer"
                    }
                },
                "tokenizer": {
                    "path-tokenizer": {
                        "type": "path_hierarchy",
                        "delimiter": "/"
                    }
                }
            }
        },
        "mappings": {
            "catalog": {
                "properties": {
                    "date": {
                        "type": "date"
                    },
                    "catalogUri": {
                        "type": "string",
                        "index": "not_analyzed"
                    },
                    "harvestUrl": {
                        "type": "string",
                        "index": "not_analyzed"
                    },
                    "publisher": {
                        "properties": {
                            "orgPath": {
                                "type": "string",
                                "analyzer": "path-analyzer",
                                "search_analyzer": "keyword"
                            }
                        }
                    }
                }
            },
            "dataset": {
                "properties": {
                    "date": {
                        "type": "date"
                    },
                    "datasetId": {
                        "type": "string",
                        "index": "not_analyzed"
                    },
                    "datasetUri": {
                        "type": "string",
                        "index": "not_analyzed"
                    }
                }
            },
            "lookup": {
                "properties": {
                    "datasetId": {
                        "type": "string",
                        "index": "not_analyzed"
                    },
                    "harvestUri": {
                        "type": "string",
                        "index": "not_analyzed"
                    }
                }
            }
        }
    }'



    # recreate data in target environment
    echo "loading harvest_lookup"
    elasticdump --input=${environment}_harvest_lookup.json --output=${targetElasticUrl}/harvest --type=data
    echo "loading harvest_catalog ..."
    elasticdump --input=${environment}_harvest_catalog.json --output=${targetElasticUrl}/harvest --type=data
    echo "loading harvest_dataset ..."
    elasticdump --input=${environment}_harvest_dataset.json --output=${targetElasticUrl}/harvest --type=data

    ENDTIME=`date "+%Y-%m-%dT%H_%M_%S"`

    echo "finished dump ${ENDTIME}"
}


if [ -z "$1" ]
then
    echo "environment must be specified: ut1, st1, st2, tt1 ppe or prd"
    echo "correct usage: loadHarvestEnv.sh <environment>"
    exit 1
fi

echo "This will delete elasticsearch index in $1 and attempt to load previously dumped harvest files into elasticsearch"
read -r -p "Are you sure? [y/N] " response

if [[ "$response" =~ ^([yY][eE][sS]|[yY])+$ ]]
then
    startLoad $1
else
    exit 1
fi


echo "Done";

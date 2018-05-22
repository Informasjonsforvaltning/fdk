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

    DATETIME=`date "+%Y-%m-%dT%H_%M_%S"`

    echo "Starting dump ${DATETIME}"

    # prepare target environment
    echo "Delete dcat index"
    curl -XDELETE ${targetElasticUrl}/dcat

    echo "Create index with mapping"

    curl -XPOST ${targetElasticUrl}/dcat -d '{
  "subject": {
    "properties": {
      "altLabel": {
        "properties": {
          "no": {
            "type": "string",
            "analyzer": "norwegian"
          }
        }
      },
      "creator": {
        "properties": {
          "id": {
            "type": "string"
          },
          "naeringskode": {
            "properties": {
              "code": {
                "type": "string"
              },
              "prefLabel": {
                "properties": {
                  "no": {
                    "type": "string"
                  }
                }
              },
              "uri": {
                "type": "string"
              }
            }
          },
          "name": {
            "type": "string",
            "analyzer": "norwegian",
            "fields": {
              "raw": {
                "type": "string",
                "index": "not_analyzed"
              }
            }
          },
          "orgPath": {
            "type": "string",
            "analyzer": "path-analyzer",
            "search_analyzer": "keyword"
          },
          "organisasjonsform": {
            "type": "string"
          },
          "overordnetEnhet": {
            "type": "string"
          },
          "sektorkode": {
            "properties": {
              "code": {
                "type": "string"
              },
              "prefLabel": {
                "properties": {
                  "no": {
                    "type": "string"
                  }
                }
              },
              "uri": {
                "type": "string"
              }
            }
          },
          "uri": {
            "type": "string"
          },
          "valid": {
            "type": "boolean"
          }
        }
      },
      "definition": {
        "properties": {
          "no": {
            "type": "string",
            "analyzer": "norwegian"
          }
        }
      },
      "identifier": {
        "type": "string"
      },
      "inScheme": {
        "type": "string",
        "analyzer": "norwegian",
        "fields": {
          "raw": {
            "type": "string",
            "index": "not_analyzed"
          }
        }
      },
      "note": {
        "properties": {
          "no": {
            "type": "string",
            "analyzer": "norwegian"
          }
        }
      },
      "prefLabel": {
        "properties": {
          "no": {
            "type": "string",
            "analyzer": "norwegian",
            "fields": {
              "raw": {
                "type": "string",
                "index": "not_analyzed"
              }
            }
          }
        }
      }
    }
  }
}
    '



    # recreate data in target environment
    echo "Dump data into target environment"
    elasticdump --input=${environment}_dcat_data.json --output=${targetElasticUrl}/dcat --type=data

    ENDTIME=`date "+%Y-%m-%dT%H_%M_%S"`

    echo "finished dump ${ENDTIME}"
}


if [ -z "$1" ]
then
    echo "environment must be specified: ut1, st1, st2, tt1 ppe or prd"
    echo "correct usage: loadDcatEnv.sh <environment>"
    exit 1
fi

echo "This will delete elasticsearch index <dcat> in $1 and attempt to load previously dumped dcat index content into elasticsearch"
read -r -p "Are you sure? [y/N] " response

if [[ "$response" =~ ^([yY][eE][sS]|[yY])+$ ]]
then
    startLoad $1
else
    exit 1
fi

echo "Done";

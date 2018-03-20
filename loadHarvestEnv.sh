#!/usr/bin/env bash
set -e

environment=st2
targetElasticUrl=http://elasticsearch-fellesdatakatalog-${environment}.ose-npc.brreg.no


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
echo "Copy file into target environment"
elasticdump --input=${environment}_harvest_lookup.json --output=${targetElasticUrl}/harvest --type=data
elasticdump --input=${environment}_harvest_catalog.json --output=${targetElasticUrl}/harvest --type=data
elasticdump --input=${environment}_harvest_dataset.json --output=${targetElasticUrl}/harvest --type=data

ENDTIME=`date "+%Y-%m-%dT%H_%M_%S"`

echo "finished dump ${ENDTIME}"

echo "Done";

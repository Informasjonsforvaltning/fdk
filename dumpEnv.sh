#!/usr/bin/env bash
set -e

# Dumps dcat and harvest index from prod elasticsearch to file
# Steps:
#       1. dump indexes with elasticdump to files

# requires: npm install elasticdump@2.1.0 -g


#sourceElasticUrl=http://elasticsearch-fellesdatakatalog-ppe.ose-pc.brreg.no
sourceElasticUrl=http://elasticsearch-fellesdatakatalog-st2.ose-npc.brreg.no
environment=st2

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


function parameterErrorMsg {
  echo "correct usage: ./dump2env.sh <hostname> <port> <clustername>"
  echo "example: ./dump2env.sh localhost 9300 elasticsearch"
}

echo "Done";

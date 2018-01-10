#!/usr/bin/env bash
set -e

# Dumps dcat and harvest index from prod elasticsearch to file
# Steps:
#       1. dump indexes with elasticdump to files

# requires: npm install elasticdump@2.1.0 -g


sourceElasticUrl=http://elasticsearch-fellesdatakatalog-ppe.ose-pc.brreg.no

dcatfile=ppe_dcat_data.json
harvestfile=ppe_harvest_data.json

DATETIME=`date "+%Y-%m-%dT%H_%M_%S"`

echo "Starting dump ${DATETIME}"

rm -f ${dcatfile} ${harvestfile}

# dump source
echo "Dumping source to files"
elasticdump --input=${sourceElasticUrl}/dcat --output=${dcatfile} --type=data
elasticdump --input=${sourceElasticUrl}/harvest/lookup --output=ppe_harvest_lookup.json --type=data
elasticdump --input=${sourceElasticUrl}/harvest/catalog --output=ppe_harvest_catalog.json --type=data


ENDTIME=`date "+%Y-%m-%dT%H_%M_%S"`
echo "finished dump ${ENDTIME}"


function parameterErrorMsg {
  echo "correct usage: ./dump2env.sh <hostname> <port> <clustername>"
  echo "example: ./dump2env.sh localhost 9300 elasticsearch"
}

echo "Done";

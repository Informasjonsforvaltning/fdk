#!/usr/bin/env bash
set -e

# Dumps dcat and harvest index from prod elasticsearch to file and recreates it in a target test environment
# Steps:
#       1. dump indexes with elasticdump to files
#       2. delete indexes on target test environment
#       3. recreate settings and mapping for target test environment
#       4. dump incexes from file to target test environment


# some input validation
if [ -z "$1" ]
then
    echo "hostname must be given"
    parameterErrorMsg
    exit 1
fi

if [ -z "$2" ]
then
    echo "port must be specified"
    parameterErrorMsg
    exit 1
fi

if [ -z "$3" ]
then
    echo "Elasticsearch clustername must be specified"
    parameterErrorMsg
    exit 1
fi

host=$1
port=$2
clustername=$3

targetElasticUrl=http://localhost:9200
environment=ut1


DATETIME=`date "+%Y-%m-%dT%H_%M_%S"`

echo "Starting dump ${DATETIME}"

# prepare target environment
echo "Prepare target environment (deletes all objects and recreates mapping and indexes"
java -jar applications/migration/target/migration-0.2.4-SNAPSHOT-exec.jar ${host} ${port} ${clustername}

# recreate data in target environment
echo "Copy file into target environment"
elasticdump --input=${environment}_dcat_data.json --output=${targetElasticUrl}/dcat --type=data
elasticdump --input=${environment}_harvest_lookup.json --output=${targetElasticUrl}/harvest --type=data
elasticdump --input=${environment}_harvest_catalog.json --output=${targetElasticUrl}/harvest --type=data
elasticdump --input=${environment}_harvest_dataset.json --output=${targetElasticUrl}/harvest --type=data


ENDTIME=`date "+%Y-%m-%dT%H_%M_%S"`

echo "finished dump ${ENDTIME}"


function parameterErrorMsg {
  echo "correct usage: ./dump2env.sh <hostname> <port> <clustername>"
  echo "example: ./dump2env.sh localhost 9300 elasticsearch"
}





echo "Done";

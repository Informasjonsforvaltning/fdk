#!/usr/bin/env bash
set -e

components="fuseki harvester harvester-api nginx reference-data registration registration-api registration-auth registration-validator search search-api"
toEnvironment=ut1
DATETIME=`date "+%Y-%m-%dT%H_%M_%S"`

for i in $components
  do
    echo "Tagging and pushing images for ${i}"
    docker push dcatno/${i}:latest
    docker tag dcatno/${i}:latest dcatno/${i}:${toEnvironment}_latest
    docker push dcatno/${i}:${toEnvironment}_latest
    docker tag dcatno/${i}:latest dcatno/${i}:${toEnvironment}_${DATETIME}
    docker push dcatno/${i}:${toEnvironment}_${DATETIME}
done


git push --delete origin ${toEnvironment}_latest || true
git tag --delete ${toEnvironment}_latest || true

git tag ${toEnvironment}_latest
git tag ${toEnvironment}_${DATETIME}

git push origin --tags
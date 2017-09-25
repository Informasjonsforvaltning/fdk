#!/usr/bin/env bash
set -e


components="fuseki harvester harvester-api nginx reference-data registration registration-api registration-auth registration-validator search search-api"
toEnvironment=ut1
DATETIME=`date "+%Y-%m-%dT%H_%M_%S"`

echo "Logging in to dockerhub as ${dockerUsername}";
docker login --username ${dockerUsername} --password ${dockerPassword}
echo "Logged in to dockerhub"

for i in $components
  do
    echo "Tagging and pushing images for ${i}"

    echo "Pushing latests:  ${i}"
    docker push dcatno/${i}:latest
    echo "Pushed latests:  ${i}"

    echo "Tagging latests  dcatno/${i}:${toEnvironment}_latest"
    docker tag dcatno/${i}:latest dcatno/${i}:${toEnvironment}_latest
    echo "Tagged latests  dcatno/${i}:${toEnvironment}_latest"

    echo "Pushing latests  dcatno/${i}:${toEnvironment}_latest"
    docker push dcatno/${i}:${toEnvironment}_latest
    echo "Pushed latests  dcatno/${i}:${toEnvironment}_latest"

    echo "Tagging with datatime dcatno/${i}:${toEnvironment}_${DATETIME}"
    docker tag dcatno/${i}:latest dcatno/${i}:${toEnvironment}_${DATETIME}
    echo "Tagged with datatime dcatno/${i}:${toEnvironment}_${DATETIME}"

    echo "Pushing  dcatno/${i}:${toEnvironment}_${DATETIME}"
    docker push dcatno/${i}:${toEnvironment}_${DATETIME}
    echo "Pushed  dcatno/${i}:${toEnvironment}_${DATETIME}"

done

echo "Git deleting remote tag: ${toEnvironment}_latest"
git push --delete origin ${toEnvironment}_latest || true
echo "Git deleted remote tag: ${toEnvironment}_latest"

echo "Git deleting local tag: ${toEnvironment}_latest"
git tag --delete ${toEnvironment}_latest || true
echo "Git deleted local tag: ${toEnvironment}_latest"

echo "Git tagging ${toEnvironment}_latest"
git tag ${toEnvironment}_latest
echo "Git tagged ${toEnvironment}_latest"

echo "Git tagging ${toEnvironment}_${DATETIME}"
git tag ${toEnvironment}_${DATETIME}
echo "Git tagged ${toEnvironment}_${DATETIME}"

echo "Git pushing"
git push origin --tags
echo "Git pushed"
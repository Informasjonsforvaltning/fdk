#!/usr/bin/env bash
set -e

source ./buildGroupsEnv.sh

applications="${BUILD_APPS[@]}"
toEnvironment=ut1
DATETIME=`date "+%Y-%m-%dT%H_%M_%S"`

integrationtag=$(./citools/getIntegrationTag.sh)

# pull images of all applications with integration tag (indicates that integration for set is passed)
# the script will fail if image is not found
echo "Pulling integration images for all applications with tag $integrationtag"
for i in "${!BUILD_APPS[@]}"; do
    ./citools/pullApplicationsByTag.sh "${BUILD_APPS[$i]}" $integrationtag;
done


if [ "$dockerUsername" ]
then
    echo "Logging in to dockerhub as ${dockerUsername}";
    docker login --username ${dockerUsername} --password ${dockerPassword}
    echo "Logged in to dockerhub"
fi

echo "Tag and push all application images as latest"
./citools/retagApplications.sh "$applications" $integrationtag latest push

echo "Tag and push all application images for deployment ${toEnvironment}_latest"
./citools/retagApplications.sh "$applications" $integrationtag ${toEnvironment}_latest push

echo "Tag and push all application images for deployment timestamp ${toEnvironment}__${DATETIME}"
./citools/retagApplications.sh "$applications" $integrationtag ${toEnvironment}_${DATETIME} push

echo "Setting origin to use correct username and password"
git remote set-url origin https://${githubUsername}:${githubPassword}@github.com/Informasjonsforvaltning/fdk.git

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
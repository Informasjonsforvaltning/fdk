#!/usr/bin/env bash
set -e

tag=dcatno/$1:$2_latest

sourceTag=dcatno/$1:latest

echo tagging $sourceTag with $tag

docker tag $sourceTag $tag

docker push $tag

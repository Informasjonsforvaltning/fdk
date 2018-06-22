#!/usr/bin/env bash
set -e

 mvn clean install -T 2C -pl applications/$1 -am -DskipTests

 docker-compose stop $1 || true
 docker-compose up -d $1

if [ "$2" == "logs" ]; then
   docker-compose logs -f $1
fi

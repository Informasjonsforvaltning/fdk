#!/usr/bin/env bash
set -e

if [ $1 = "registration-react" ]
then
    cd applications/registration-react
    docker build -t dcatno/registration-react:latest .
else if [ $1 = "search" ]
  then
    cd applications/search
    docker build -t dcatno/search:latest .
  else
    mvn clean install -T 2C -pl applications/$1 -am -DskipTests
  fi
fi

 docker-compose stop $1 || true
 docker-compose up -d $1

if [ "$2" == "logs" ]; then
   docker-compose logs -f $1
fi

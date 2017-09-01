#!/usr/bin/env bash

 mvn clean install -T 2C -pl applications/$1 -am -DskipTests  -Dmaven.exec.skip=true

 docker-compose up -d $1

docker-compose restart nginx
#!/usr/bin/env bash


mvn clean
mvn install -DskipTests -Dmaven.javadoc.skip=true -Dskip.npm -B -V

docker-compose down
rm -r data
docker stop $(docker ps -a -q); docker rm $(docker ps -a -q); docker volume rm $(docker volume ls -qf dangling=true)
docker-compose up -d

./waitForDocker.sh

say "Docker is running"
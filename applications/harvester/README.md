# Harvester application

Docker image: [dcatno/harvester](https://hub.docker.com/r/dcatno/harvester/)
Base image: [frolvlad/alpine-oraclejdk8:slim]()
Source: [Dockerfile]()

The harvester administration application. It allows users to register 
external data catalogs to be harvested at regular intervals.

The harvester currently runs once a day at 1am.


# Use

`docker run -p 8082:8080 dcatno/harvester`
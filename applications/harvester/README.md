# Harvester administration application

Docker image: [dcatno/harvester](https://hub.docker.com/r/dcatno/harvester/)
Base image: [openjdk:8-jre](https://hub.docker.com/_/openjdk/)
Source: [Dockerfile](https://github.com/Informasjonsforvaltning/fdk/blob/master/applications/harvester/src/main/docker/Dockerfile)

## Overview
The harvester administration application. It allows users to register 
external data catalogs (data sources) to be harvested at regular intervals.

The harvester currently runs once a day at 1am. Harvests can also be triggered manually.

## Technologies/frameworks
* Java
* Spring Boot v. 1.5.1
* Apache Jena v.3.3.0
* Thymeleaf for user interface

## Architecture
The harvester module consists of to subcomponents:
* REST controllers (DcatAdminRestController and UserAdminRestController) supporting the following operations:
    * GET /api/admin/dcat-sources
      - Returns data sources available for harvesting
    * POST /api/admin/dcat-source
      - Add new data source to be harvested
    * DELETE /api/admin/dcat-source
      - Removes data source. The data source will no longer be harvested
    * POST /api/admin/user
      - add new user (User that can administer data sources)
    * DELETE /api/admin/user
      - delete user
    
* A simple web user interface (DcatAdminController) for managing users and catalogs to be harvested.
  This interface calls operations in the REST controller. The user interface has a simple authentication mechanism.

## Dependencies
The harvester module is dependent on the following other modules:
* Harvester-api (REST api)
    * Harvests are triggered by calling a rest api on the harvester-api module:
        * /api/admin/harvest
            - parameter: id: The id of the data source to be harvested
* Fuseki (REST api)
    * Information about users and data catalogs are stored in Fuseki database admin
    * Log information about harvests are retrieved from Fuseki database admin
* Elasticsearch (api)
* Library: no.dcat.datastore
    * Provides Java interfaces for communicating with Elasticsearch and Fuseki


## Use

`docker run -p 8082:8080 dcatno/harvester`
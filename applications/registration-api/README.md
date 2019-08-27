# Registration api

Docker image: [dcatno/registration-api](https://hub.docker.com/r/dcatno/registration-api/)
Base image: [frolvlad/alpine-oraclejdk8:slim](https://hub.docker.com/r/frolvlad/alpine-oraclejdk8/)
Source: [Dockerfile](hhttps://github.com/Informasjonsforvaltning/fdk/blob/develop/applications/registration-api/src/main/docker/Dockerfile))

##  Overview
Registration api provides a REST service for creating, updating and storing DCAT-AP-NO 1.1. dataset descriptions.  

## Technologies/frameworks
* Java
* Spring Boot v1.5.9
* Apache Jena v.3.3.0

## API
Registration api exposes several endpoints for CRUD on catalogs and dataset descriptions.

* ```GET /catalogs```
    * Returns all catalogs user is authorized for as JSON.
* ```POST /catalogs```
    * Create a catalog, catalog as JSON in payload.
    * Returns a catalog as JSON.
* ```GET /catalogs/{id}```
    * Returns a catalog as JSON.
    * Parameter
        - ```id``` : Get catalog with this id.
* ```PUT /catalogs/{id}```
    * Delete a catalog.
    * Return HTTP.OK or HTTP.NOT_FOUND.
    * Parameter
        - ```id``` : Delete catalog with this id.
* ```DELETE /catalogs/{id}```
    * Modify a catalog, catalog as JSON in payload.
    * Parameter
        - ```id``` : Modify catalog with this id.
* ```GET /catalogs/{catalogId}/datasets/{id}```
    * Returns a dataset description as JSON.
    * Parameters
        - catalogId: Id of the catalog.
        - ```id``` : Get a dataset with this id.
* ```GET /catalogs/{catalogId}/datasets```
    * Returns all dataset descriptions in a catalog.
    * Parameter
        - ```catalogId``` : Id of the catalog.
* ```POST /catalogs/{catalogId}/datasets```
    * Create a dataset description, dataset description as JSON in payload. 
    * Returns the created dataset as JSON.
* ```PUT /catalogs/{catalogId}/datasets/{id}```
    * Modify a dataset description, dataset description as JSON in payload.
    * Returns the modified dataset as JSON. 
    * Parameters
        - ```catalogId``` : Id of the catalog.
        - ```id``` : Modify dataset description with this id.
* ```DELETE /catalogs/{catalogId}/datasets``` 
    * Delete a dataset description.
    * Returns HTTP.OK or HTTP.NOT_FOUND.
    * Parameters
        - ```catalogId``` : Id of the catalog.
        - ```id``` : Delete dataset description with this id.
* ```GET /subjects?uri={uri}```
    * Returns 1...n subject(s) as JSON.
    * Parameter
        - ```uri``` : Uri to which subject(s) in DCAT format to get.

## Dependencies
* reference-data
* elasticsearch
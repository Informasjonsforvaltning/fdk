# Search application for DCAT-AP-NO 1.1

Docker image: [dcatno/search](https://hub.docker.com/r/dcatno/search/)
Base image: [ubuntu](https://hub.docker.com/_/ubuntu/)
Source: [Dockerfile](https://github.com/Altinn/fdk/blob/master/portal/webapp/src/main/docker/Dockerfile)

Provides query and filtering capabilities for searching a collection of DCAT catalogs and dataset descriptions. The application access a search-api and a database cluster (elasticsearch/fuseki) and presents search results and analysis functionality to the user.


# License
dcatno/search: [Apache License, version 2.0](http://www.apache.org/licenses/LICENSE-2.0)

# Use

`docker run -p 8080:8080 dcatno/search`




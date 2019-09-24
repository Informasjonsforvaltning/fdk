# Reference-data

Docker image: [dcatno/reference-data-api](https://hub.docker.com/r/dcatno/registration-api/)
Base image: [frolvlad/alpine-oraclejdk8:slim](https://hub.docker.com/r/frolvlad/alpine-oraclejdk8/)
Source: [Dockerfile](https://github.com/Informasjonsforvaltning/fdk/develop/applications/reference-data/src/main/docker/Dockerfile)

##  Overview
Reference-data is a service that provides metadata for the various applications in this ecosystem. It provides code-lists, concepts and helptexts. 

# Technologies/frameworks
* Java
* Spring Boot v1.5.9
* Apache Jena v.3.3.0
* JSON-LD framing
* Apache Jena TDB: To store the codes as RDF.

## API

The code api provides REST service for:

* `GET /codes`
    * Returns all code-lists that can be used.
    
* `GET /codes/codeType`
    * Returns the codes of a specific code type. The following code types are supported:
        1. `provenancestatement`: codes that specify the provenance (origin) of the dataset (VEDTAK, BRUKER, TREDJEPART)
        2. `rightsstatement`: codes to indicate the access rights of a dataset (PUBLIC, NON_PUBLIC, RESTRICTED)
        3. `frequency`: codes to tell the update frequency of a dataset (ANNUAL, BIMONTHLY, CONT, ...)
        3. `linguisticsystem`: codes to specify the language used in the data (NOR, ENG, SAM, ...)
        3. `referencetypes`: codes to specify the semantic of relations (versionOf, isPartOf, Requires, ...)
        1. `location`: codes used to specify the spatial/geographic extent of a dataset
        1. `subject`: concepts used to describe a dataset sematically
        

* `GET /helptexts`
    * Return the helptexts used by the registration application
    
* `GET /themes`
    * Return the code list of European theme codes (AGRI, ENER, SOCI, ...)
    
There are also two internal api's used by the registration application to add new subjects and location codes to the database.

* `POST /locations` which add a location to the database. In order to fill the locations table, harvest https://data.norge.no/api/dcat2/data.jsonld
* `GET /subjects` which asks for a subject-uri. If it is not already in the database the service tries to fetch the subjects definition from the uri and 
stores the definition in the database for furter access.
    
## Known problems

We have had some problem with the TDB database. Sometimes it fails to restart due to a lock file. In those cases we have had to delete the lock file.

The framing to parse the JSON-LD metadata description is very brittle and difficult to debug. Thus we should replace the framing code with java code to parse the RDF. This is done for the subject service.
 

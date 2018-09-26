# Harvester api

Docker image: [dcatno/harvester-api](https://hub.docker.com/r/dcatno/harvester-api/)
Base image: [openjdk:8-jre](https://hub.docker.com/_/openjdk/)
Source: [Dockerfile](https://github.com/Informasjonsforvaltning/fdk/blob/master/applications/harvester-api/src/main/docker/Dockerfile)

## Overview
The harvester api runs harvests of DCAT-AP-NO 1.1 data at regular intervals.

The harvester currently runs once a day at 1am, or when triggered from harvester gui.

The harvester api processes dcat data source (url) which contains a dcat catalog and number of datasets.

1) First step is to download dcat data source at url and check that it is a valid RDF file (turtle, jsonld and rdf/xml is supported).
2) Validate the rdf model according to dcat-ap-en 1.1
3) Enhance existing data
   - with information about publishers and creators via lookup to http://data.brreg.no/enhetsregisteret
   - with theme information via lookup in reference-data 
   - with code information via lookup in reference-data 
4) Store model as a graph in rdf-database
5) Convert model to java, strip non-valid codes.
6) Create identifiers for dataset and lookup table
7) Create dataset harvest and catalog harvest records to log what is in the dcat index
8) Populate dcat index with valid datasets
9) Remove datasets that are no longer exported 

## Standards
* DCAT-AP-NO 1.1 https://doc.difi.no/dcat-ap-no/
    * The standard prescribes how data sets and catalogues should be described
      using the W3C DCAT vocabulary. The harvester module expects data sources
      to conform to this standard.

## Technologies/frameworks
* Java
* Spring Boot v. 2.0.4
* Elasticsearch v. 5.6.9
* Apache Jena v.3.3.0

## Architecture
The harvester-api module consists of a REST interface for triggering harvests,
and a scheduler that starts harvests of all datasets at 01.00 each day.

Harvesting is handled asynchronically by crawlerjobs.
Each data source to be harvested gets its own instance of a CrawlerJob.
The CrawlerJob has the following responsibilities:
* Read data from data source URI
* Validate data
* Enhance data (as specified above)
* Pass the validated and enhanced data to one or more ResultHandlers
    * Currently, two ResultHandles are used, one each of the following:
        * ElasticSearchResultHandler
            * Writes the data to Elastichsearch index dcat
            * Writes harvest record to Elasticsearch index dcat
        * FusekiResultHandler
            * Writes a RDF graph of the data to fuseki database dcat
* Trigger a SubjectCrawler to harvest subjects  from URIs encountered in the data
    * These are passed to the reference-data service for storage
    * Additionaly, the subjects are added to the dcat index
* Write log entry to Fuseki database admin


## Interface
The harvester-api module exposes a rest api for managing harvests:
* POST /api/admin/load
    * Load DCAT data file into Fuseki and Elasticsearch. Primarily used for testing.
    * Parameters: 
	    * filename: File to be loaded
	    * data: Base64 encoded DCAT data
	
* POST /api/admin/harvest
    * Start harvest of dataset from data source prescribed in parameter id
    * Parameters:
	    * id: id of data source to be harvested
	
* POST /api/admin/harvest-all
    * Start harvest of all data sources
    * Parameters: None

* GET /api/admin/isIdle
    * Answers true if the harvester is not harvesting.

## Dependencies
The harvester module is dependent on the following other modules in project fdk:
* Fuseki (REST api)
    * Harvested catalogs are stored as graphs in Fuseki database dcat
    * Log information about harvests are stored in Fuseki database admin
* Elasticsearch ( api)
    * Harvested catalogs are stored as documents in Elasticsearch index dcat
    * A record of each harvest is stored in Elasticsearch index harvest
* Reference-data (REST api)
    * The harvester reads and updates reference data during harvest:
        * Code lists
        * Themes
        * Subjects
* Library: no.dcat.shared
    * Provides Java definitions of data structures (models)
* Library: no.dcat.datastore
    * Provides Java interfaces for communicating with Elasticsearch and Fuseki

## External service dependencies
The harvester module depends on the following external services.
These services are not provided as part of the fdk projedt:
* http://data.brreg.no/enhetsregisteret
    * Consumed by harvester. Provides information about the
      legal structure of organizations in Norway

## Use

`docker run -p 8082:8080 dcatno/harvester-api`
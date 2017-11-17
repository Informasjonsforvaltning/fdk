# Harvester api

Docker image: [dcatno/harvester-api](https://hub.docker.com/r/dcatno/harvester/)
Base image: [frolvlad/alpine-oraclejdk8:slim]()
Source: [Dockerfile]()

The harvester api runs harvests of DCAT-AP-NO 1.1 data at regular intervals.

The harvester currently runs once a day at 1am.

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


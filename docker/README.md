# Docker module

Used for starting containers locally with docker compose. You need docker installed.

# Usage

## Search application:
>`docker-compose up -d search`

This starts DCAT repositories, fuseki and elasticsearch, as well as the search-api service. 
To access the search application start a browser on [http://localhost:8080](http://localhost:8080). Be aware that 
there is no data registered in the repositories (see the harvester application)

## Harvester application:
>`docker-compose up -d harvester`

This starts the harvester application with the corresponding harvester-api. 
Log in to the administration application on [http://localhost:8082](http://localhost:8082).
You will need a username and a password for the application. 

## Registration application:
>`docker-compose up -d registration`

This starts the registration application with corresponding api services. 
The application can be accessed on [http://localhost:4200](http://localhost:4200)
Currently you will be logged in as bjg ( a test user ).

## Google doc DCAT import application
>`docker-compose up -d gdoc`

This starts the Google sheet translation service. It reads a predefined set of google 
documents (sheets) and translates them to DCAT format. It runs the conversion each hour.

## Shut down all containers:
>`docker-compose down`

# Storage
The repository is stored in a persistent volume, see [data/esdata](data/esdata) for elasticsearch 
repository and [data/fuseki](data/fuseki) for the fuseki repository. 
  * Elasticsearch stores the data in JSON denormalized for search
  * Fuseki stores the data in RDF/DCAT format

# Logs

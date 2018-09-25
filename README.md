
[![Build Status](https://travis-ci.org/Informasjonsforvaltning/fdk.svg?branch=master)](https://travis-ci.org/Informasjonsforvaltning/fdk) 
[![codecov](https://codecov.io/gh/Informasjonsforvaltning/fdk/branch/develop/graph/badge.svg)](https://codecov.io/gh/Informasjonsforvaltning/fdk)

# The National Data Directory (Felles datakatalog)

This repository contains the source code for the [National Data Directory](https://fellesdatakatalog.brreg.no) of Norway. 
The work is led by the [Brønnøysund Register Centre](https://www.brreg.no/home/) and the Data Directory was launched November 2017. 
The Data Directory contains metadata about the datasets that the various Governmental bodies maintain in their data catalogs. 
We provide a search service that allow users to discover datasets and where they are kept. 
The content of the data catalog is harvested once a day from several more specific data catalogs including the registration application.  
The data catalogs are formatted according to the Norwegian profile [DCAT-AP-NO 1.1](https://doc.difi.no/dcat-ap-no/)
of the [European profile](https://joinup.ec.europa.eu/release/dcat-ap-v11) of [W3C's Data Catalog standard](https://www.w3.org/TR/vocab-dcat/). 

Three main applications are developed:
  1. A Search Application that allow users to search and browse metadata about the datasets.
  1. A Harvester Application that downloads data catalogs and makes them searchable.
  1. A Registration Application that allow users to register metadata about their datasets.

Norwegian description:
> [Felles datakatalog](https://fellesdatakatalog.brreg.no) gir en oversikt over datasett fra virksomheter i Norge. Løsningen er
utviklet av [Brønnøysundregistrene](https://www.brreg.no/) i perioden 2016 til desember 2017. Løsningen 
ble lansert i november 2017. Det er en av flere felleskomponenten som
utvikles i regi av [Skate](https://www.difi.no/fagomrader-og-tjenester/digitalisering-og-samordning/skate) 
som skal bidra til å bedre integrasjon mellom offentlige virksomheter og bedre tjenester. 
Systemet er basert på en norsk profil [DCAT-AP-NO 1.1](https://doc.difi.no/dcat-ap-no/),
av en [Europeisk profil](https://joinup.ec.europa.eu/release/dcat-ap-v11) av [W3C Datakatalog standard](https://www.w3.org/TR/vocab-dcat/)
for utveksling av datasettbeskrivelser. 

# Contact

If you have any questions please send them to [fellesdatakatalog@brreg.no](mailto:fellesdatakatalog@brreg.no).

# Usage

# Test the search application
The search application is available [here](https://fellesdatakatalog.brreg.no). The two other applications
are only available for registered users. 
Any questions can be sent to [fellesdatakatalog@brreg.no](mailto:fellesdatakatalog@brreg.no).

The [search api](https://fellesdatakatalog.brreg.no/swagger-ui.html) can also be used.

## Set up your developement environnement
  1) Clone this repo
  2) Install Java8, Maven and Docker. 
  If you have a Mac, running this script will install Java8 and Maven automatically: 

         ./install-dependencies-mac.sh
  3) (re)compile the entire project: 

         ./runAll.sh  

	  If you only want to compile one module ("search-api" in this example), use the following:     

         ./runDocker.sh search-api
	 
	 Frontend applications such as search and registration-react are built and run the following way:
	 
	 docker-compose up -d --build registration-react

  4) Run without compiling the entire project using 

          docker-compose up -d
	  ...or a specific module  ("registration" in this example) using

            docker-compose up -d registration
  5) Run end2end tests
      
      brew cask install chromium

      cd applications/e2e
      
      // install npm dependencies
      npm i

      // run tests in chromium
      npm t
      
      // run tests headless
      npm test:headless

            

## Run from Docker Hub
The docker images are also available on [Docker Hub](https://hub.docker.com/u/dcatno/). 
This means that you do not have to compile the project to run it. But you need docker installed on your computer.
You need to download the following two files [docker-compose.yml](/docker-compose.yml) and
[docker-compose.override.yml](/docker-compose.override.yml). And then you can run the following command:

        docker-compose up -d

# Modules 

![Architecture](/images/fdk-architecture-logic.png)

The Registration Application consists of the following main modules:
  * registration, a React application which allow users to log in and edit or register metadata about datasets.
  * registration-api, a Java Spring Boot service which supports a REST API
  * registration-db, a Elasticsearch document database
  * registration-auth, A Java Spring Boot service that act as a authentication and authorization service. Used
  in develop and test to skip IDPorten and Altinn integrations.
  
The Search Application consists of the following modules
  * search, a React application which allow users to search and view dataset descriptions.
  * search-api, an Java Spring Boot service whit a REST API 
  * search-db, an Elasticsearch search and document database

The Harvester Application consist of the following modules
  * harvester, a Java Spring Boot application which allow users to register which catalogs that should be harvested.
  * harvester-api, a Java Spring Boot service which checks and harvests data catalogs and inserts them into the search-db
  * harvester-db, a Fuseki RDF database which stores administration information about harvests and the incoming datasets
  
Common Services
  * reference-data, a shared service which provides code lists, concepts and helptexts.

External Integrations
  * Enhetsregisteret, for checking and collecting information about organizations
  * IDPorten, for authentication of users
  * Altinn, for authorization of users

# Start individual applications
There is a couple of scripts that automates build and run the various models ondocker. The scripts are:
  * `./runDocker.sh search-api` to compile, build and run the search-api module on docker
  * `./runAll.sh` to run all the modules on docker, it actually downloads images from docker hub or builds them if
   you have made changes to the code.
  

## Search application:
>`docker-compose up -d search`

This starts DCAT repositories, fuseki and elasticsearch, as well as the search-api service. 
To access the search application start a browser on [http://localhost:8080](http://localhost:8080). Be aware that 
there is no data registered in the repositories (see the harvester application)

## Harvester application:
>`docker-compose up -d harvester`

This starts the harvester application with the corresponding harvester-api. 
  - Log in to the administration application on [http://localhost:8082](http://localhost:8082).
      You will need a username and a password for the application (test_user, password). 
  - Next you need to register a catalog to be harvested. You may use the registration application to register data about datasets which can be harvested here. 
    [http://registration-api:8080/catalogs/123456699](http://registration-api:8080/catalogs/123456699) given your catalog has id 123456699.    

## Registration application:
>`docker-compose up -d registration`

This starts the registration application with corresponding api services. 
The application can be accessed on [http://localhost:8099](http://localhost:8099)
The regstration application requires authentication. The following test-user identifiers 
can be used: (03096000854, 01066800187, 23076102252)

## Shut down all containers:
>`docker-compose down`

## Run end2end tests (java)

 - In IntelliJ, select module applications/end2end-test and click "run tests"
 - with maven
    mvn test -pl applications/end2end-test/ -P end-to-end-test

# Storage
The repository is stored in a persistent volume, see [data/esdata](data/esdata) for elasticsearch 
repository and [data/fuseki](data/fuseki) for the fuseki repository. 
  * Elasticsearch stores the data in JSON denormalized for search
  * Fuseki stores the data in RDF/DCAT format

![Indexes in elasticsearch](/images/elastic-index.png)

## Continuous Integration (Travis, Codecov and Docker Hub)

We use [Travis](https://travis-ci.org) for CI (Continous Integration), 
[Codecov](https://codecov.io) for code coverage and 
[DockerHub](https://hub.docker.org) for image repository. 

Travis is configured in `.travis.yml`. Travis executes the instructions in this file to build, 
run and test the code. We have created a number of scripts that only builds the apps that have changed.

 - Travis: https://travis-ci.org/Informasjonsforvaltning/fdk
 - CodeCov: https://codecov.io/gh/Informasjonsforvaltning/fdk
 - DockerHub: https://hub.docker.com/u/dcatno/

Travis checks out the code from GitHub and builds docker images. It reports code coverage to Codecov and tags 
and pushes new images to DockerHub. Travis also downloads the images and runs integration tests.  

 
## Common Docker Problems

Some times docker can be a bit overworked and one might need to clean up.

Solution: remove old containers
> `bash: docker rm -f $(docker ps -aq)`

Remove old images
>  `bash: docker rmi -f $(docker images -q)`

Docker is slow on mac:
Docker needs at least 8G of memory
>  Docker -> Preferences -> Advanced -> Change memory to (8 GiB)

[![Build Status](https://travis-ci.org/Altinn/fdk.svg?branch=master)](https://travis-ci.org/Altinn/fdk) 
[![Coverage Status](https://coveralls.io/repos/github/Altinn/fdk/badge.svg?branch=master)](https://coveralls.io/github/Altinn/fdk?branch=master)

# The National Data Directory (Felles datakatalog)

This repository contains the source code for the [National Data Directory](https://fellesdatakatalog.brreg.no) of Norway. 
The work was funded and led by the [Brønnøysund Register Centre](https://www.brreg.no/home/) and the Data Directory was launched November 2017. 
The Data Directory contains metadata about the datasets that the various Governmental bodies maintain in their data catalogs. 
We provide a search service that allow users to discover datasets and where they are kept. 
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

# Usage

## Test the search application
The search application is available [here](https://fellesdatakatalog.brreg.no). The two other applications
are only available for registered users. 
Any questions can be sent to [fellesdatakatalog@brreg.no](mailto:fellesdatakatalog@brreg.no).

The [search api](https://fellesdatakatalog.brreg.no/swagger_ui.html) can also be used.

## Compile
The system consists of several modules which can be compiled with `mvn clean install`. 
A successful build results in corresponding docker images. 

## Run from Docker Hub
The docker images are also available on [Docker Hub](https://hub.docker.com/u/dcatno/). 
This means that you do not have to compile the project to run it. But you need docker installed on your computer.
You need to download the following two files [docker-compose.yml](/docker-compose.yml) and
[docker-compose.override.yml](/docker-compose.override.yml). And then you can run the following command:

        `docker-compose up -d`.

# Modules 

![Architecture](/images/fdk-architecture-logic.png)

The Registration Application consists of the following main modules:
  * registration, a React application which allow users to log in and edit or register metadata about datasets.
  * registration-api, a Java Spring Boot service which supports a REST API
  * registration-db, a Elasticsearch document database
  * registration-validator, a Java Spring Boot service that can validate inputdata against the DCAT standard. Currently not in use.
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
  * `./runAll.sh` to run compile, build and run all the modules on docker
  

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
  - Next you need to register a catalog to be harvested. Try to register the following url: 
    [http://gdoc-fdk.tt1.brreg.no/versions/latest](http://gdoc-fdk.tt1.brreg.no/versions/latest)
    Alternatively start the gdoc application and enter the following url 
    [http://localhost:8084/versions/latest](http://localhost:8084/versions/latest)

## Registration application:
>`docker-compose up -d registration`

This starts the registration application with corresponding api services. 
The application can be accessed on [http://localhost:8099](http://localhost:8099)
The regstration application requires authentication. The following test-user identifiers 
can be used: (03096000854, 01066800187, 23076102252)

## Shut down all containers:
>`docker-compose down`

# Storage
The repository is stored in a persistent volume, see [data/esdata](data/esdata) for elasticsearch 
repository and [data/fuseki](data/fuseki) for the fuseki repository. 
  * Elasticsearch stores the data in JSON denormalized for search
  * Fuseki stores the data in RDF/DCAT format

![Indexes in elasticsearch](/images/elastic-index.png)

## Travis and Coveralls

We use Travis for build and Coveralls for code coverage. Travis is configured in `.travis.yml`. Travis executes the instructions in this file to build, 
run and test the code.

 - Travis: https://travis-ci.org/Altinn/fdk
 - Coveralls: https://coveralls.io/github/Altinn/fdk

The travis config file has two main sections.

```$yml
 -- SECTION 1 --
language: java
...
install:
 ...

 -- SECTION 2 --
jobs:
  include:
    - stage: Build
      script: mvn install ...
   ...

```

Section 1 covers setup and configuration of travis, while section 2 covers the 
instructions for how to build and test the system. Each section has multiple phases. We use 
`before_install` and `install` in section 1, and `jobs` in section 2. Take a look at the `.travis.yml` file, 
it has inline comments for what is done in each stage.

Our Travis is set up to use Java as the main language. To support javascript we install nodejs 
version 6 in the before_install phase. Travis also supports running up docker containers and running
Chrome for automated e2e tests.

Section 2, covering how to build and test is a bit fiddly. In Jobs -> include ; there 
are many stages. Each stage runs after the previous stage, but on a clean VM. So no files are shared
between stages. Many of the stages have the same name, this makes Travis run them in parallel.
Since there is no shared data between the stages, building must happen for each stage. The reason 
for not having building in the install phase in section 1 is that maven produces a lot of useful output,
but too much output. The build stage outputs all info from maven, while all the test stages forward 
all the output to `/dev/null`. The maven builds in the test stages build in parallel with the arguments
`-T 2C` which means: use 2 threads per core. 

Coveralls is enabled by having the `org.eluder.coveralls` plugin for maven in the root `pom.xml`. 
Travis automatically injects the api key for Coveralls. Coveralls will comment on a pull request with the 
coverage % for every successful build in Travis. 

Bjørn is the user who has admin access to Travis and to Coveralls since he has admin access to the git 
repo in Github.

There is no other configuration of Travis or Coveralls besides what has been mentioned here.


 
## Common Problems

Solution: remove old containers
bash: docker rm -f $(docker ps -aq)

Remove old images
bash: docker rmi -f $(docker images -q)

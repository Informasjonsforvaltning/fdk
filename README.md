[![Build Status](https://travis-ci.org/Altinn/fdk.svg?branch=master)](https://travis-ci.org/Altinn/fdk) 
[![Coverage Status](https://coveralls.io/repos/github/Altinn/fdk/badge.svg?branch=master)](https://coveralls.io/github/Altinn/fdk?branch=master)

# Felles datakatalog

Dette er den første felleskomponenten som utvikles i regi av 
Skate (https://www.difi.no/fagomrader-og-tjenester/digitalisering-og-samordning/skate). 
Felles datakatalog skal tilby en oversikt over hvilke datasett som offentlige
virksomheter har. Det skal tilbys en søkeløsning (portal) som gjør det mulig å 
søke og finne relevante datasettbeskrivelser. Prosjektet går over 2 år med 
oppstart høsten 2016. Forventet ferdig ved utgangen av 2017. 

Systemet er basert på en norsk profil DCAT-AP-NO 1.1 av en Europeisk og W3C standard
for utveksling av datasettbeskrivelser, se https://doc.difi.no/dcat-ap-no/. 
Systemet bygger videre på kode som ble utviklet i DIFIs pilotprosjekt: 
Nasjonal infrastruktur for felles datakatalog (våren 2016). 

# Docker module

Used for starting containers locally with docker compose. You need docker installed 
and allow it to share disk.

# Download
Download the docker-compose.yml and docker-compose.override.yml files to a empty directory. Create a catalog called data. 
Then start the wanted application (se below) 

# Usage

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


## Struktur

Applikasjoner

* catalog: søkeløsning 
* harvester: høster lokale løsninger og legger inn i søkeløsningen
* registration: lar virksomheter registrere egne datasettbeskrivelser


Komponenter

* elasticsearch, kibana og logstash
* fuseki

## Kompilere
### Compile:
mvn clean install
 
man kan bruke følgende parametre for å kun kompilere: -DskipTests -DskipDockerBuild 

### Docker:
#### Start
cd docker
docker-compose up -d

#### Stop
docker-compose down


## Kjøre applikasjonene 

Portal-webapp:
http://localhost:8080

Harvester-service: 
http://localhost:8081/

Harvester-admin:
http://localhost:8082/
(ta kontakt for passord)

Portal-query:
http://localhost:8083/search

Gdoc-import:
http://localhost:8084/versions/latest

Test-admin:
http://localhost:8085/
(ta kontakt for passord)

Fuseki:
http://localhost:3030/fuseki/

Elasticsearch:
http://localhost:9200

Kibana:
http://localhost:5601/


## Common Problems

Solution: remove old containers
bash: docker rm -f $(docker ps -aq)

Remove old images
bash: docker rmi -f $(docker images -q)


## Travis and Coveralls

Travis is configured in `.travis.yml`. Travis executes the instructions in this file to build, 
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


 

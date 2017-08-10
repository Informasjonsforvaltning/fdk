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

## Struktur

Applikasjoner

* catalog: søkeløsning 
* harvester: høster lokale løsninger og legger inn i søkeløsningen
* registration: lar virksomheter registrere egne datasettbeskrivelser
* support: ulike hjelpeverktøy

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
Travis automatically injects the api key for Coveralls. 

Bjørn is the user who has admin access to Travis and to Coveralls since he has admin access to the git 
repo in Github.

There is no other configuration of Travis or Coveralls besides what has been mentioned here.


 

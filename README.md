# Felles datakatalog

Dette er den første felleskomponenten som utvikles i regi av Skate (https://www.difi.no/fagomrader-og-tjenester/digitalisering-og-samordning/skate). Felles datakatalog skal tilby en oversikt over hvilke datasett som offentlige virksomheter har. Det skal tilbys en søkeløsning (portal) som gjør det mulig å søke og finne relevante datasettbeskrivelser. Prosjektet går over 2 år med oppstart høsten 2016. Det er basert på en norsk profil DCAT-AP-NO 1.1 av en Europeisk og W3C standard for utveksling av datasettbeskrivelser. Det er basert på kode som ble utviklet i DIFIs pilotprosjekt: Nasjonal infrastruktur for felles datakatalog (våren 2016). 

## Struktur

Applikasjoner

* portal: webapp + query
* harvester: admin + harvester
* api
* test-admin

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

Portal-query:
http://localhost:8083/search

HarvesterAdmin:
http://localhost:8082/

test_user password
test_admin password

Test-admin:
http://loclahost:8084/

Elasticsearch
http://localhost:9200

Kibana
http://localhost:5601/

FUSEKI
http://localhost:3030/fuseki/


## Common Problems

Solution: remove old containers
bash: docker rm -f $(docker ps -aq)

Remove old images
bash: docker rmi -f $(docker images -q)

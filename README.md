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


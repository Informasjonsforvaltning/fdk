# Felles datakatalog

Dette er den første felleskomponenten som utvikles i regi av Skate (https://www.difi.no/fagomrader-og-tjenester/digitalisering-og-samordning/skate). Felles datakatalog skal tilby en oversikt over hvilke datasett som offentlige virksomheter har. Det skal tilbys en søkeløsning (portal) som gjør det mulig å søke og finne relevante datasettbeskrivelser. Prosjektet går over 2 år med oppstart høsten 2016. Det er basert på en norsk profil DCAT-AP-NO 1.1 av en Europeisk og W3C standard for utveksling av datasettbeskrivelser. Det er basert på kode som ble utviklet i DIFIs pilotprosjekt: Nasjonal infrastruktur for felles datakatalog (våren 2016). 

## Struktur

Applikasjoner

<<<<<<< Updated upstream
* portal
* admin
* harvester
* datastore
* api
=======
* portal: webapp + query
* harvester: admin + service
* api (currently not up)
* test-admin
>>>>>>> Stashed changes

Komponenter

* elasticsearch, kibana og logstash
* fuseki

## Kompilere og installere
### Compile:
mvn clean install -DskipTests

admin-webapp and harvester
mvn package -DskipTests

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

test_user password
test_admin password


Portal-query:
http://localhost:8083/search

Gdoc-import:
http://localhost:8084/versions/latest

Test-admin:
http://localhost:8085/

Fuseki:
http://localhost:3030/fuseki/

Elasticsearch:
http://localhost:9200

Kibana
http://localhost:5601/


## Common Problems

ERROR: for elasticsearch  No such image: sha256:09e6a3991c52f2fd3466fdc1bc34eb7a5e0929ed3367cf964c4f7e58a1fc5231
Solution: remove old containers
bash: docker rm -f $(docker ps -aq)

Remove old images
bash: docker rmi -f $(docker images -q)

# Felles datakatalog

Dette er den første felleskomponenten som utvikles i regi av Skate (https://www.difi.no/fagomrader-og-tjenester/digitalisering-og-samordning/skate). Felles datakatalog skal tilby en oversikt over hvilke datasett som offentlige virksomheter har. Det skal tilbys en søkeløsning (portal) som gjør det mulig å søke og finne relevante datasettbeskrivelser. Prosjektet går over 2 år med oppstart høsten 2016. Det er basert på en norsk profil DCAT-AP-NO 1.1 av en Europeisk og W3C standard for utveksling av datasettbeskrivelser. Det er basert på kode som ble utviklet i DIFIs pilotprosjekt: Nasjonal infrastruktur for felles datakatalog (våren 2016). 

## Struktur

Applikasjoner

* portal
* harvester
* editor
* api

Komponenter

* søkedatabase - elasticsearch, kibana og logstash
* grafdatabase - fuseki

## Kompilere og installere
### Compile:
mvn clean install

### Docker:
#### Start
cd docker
docker-compose up -d

#### Stop
docker-compose down


## Kjøre applikasjonene 
Dette krever at du har docker, java, maven installert. 

Portal: 
http://localhost:8080/

Harvester-admin:
http://localhost:8082/

Elasticsearch:
http://localhost:9200

Test-admin:
http://localhost:8085
her kan man finne testdata inne på test/data

Fuseki:
http://localhost:3030/fuseki/


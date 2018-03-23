# Search application for DCAT-AP-NO 1.1

Docker image: [dcatno/search](https://hub.docker.com/r/dcatno/search/)
Base image: [node:6.11]()
Source: [Dockerfile](https://github.com/Altinn/fdk/blob/master/applications/search/Dockerfile)

Provides query and filtering capabilities for searching a collection of DCAT catalogs and concepts.
The search application access a search-api and a database cluster (elasticsearch/fuseki) and presents search results to the user in a web ui.


# License
dcatno/search: [Apache License, version 2.0](http://www.apache.org/licenses/LICENSE-2.0)

# Use

`docker run -p 8080:8080 dcatno/search`

To run locally:

1. Run ```npm run dev``` or run ```npm run server``` to start server.

2. Open browser ```http://localhost:3000```

3. Run ```npm run build``` to build webpack bundle.

4. Run ```npm run test``` to run tests.

# Depends on

  * search-api
  * reference-data
  * fuseki
  
# Search
  
Frontend built on React 16 and Redux. Tests are written with Mocha and Enzyme. ESLint with AirBnB used for linting.

The search application do search by calling the RESTful service from search-api.

# Universal design

The design follows the WCAG 2.0 level A standard for the universal design of websites, see [WCAG 2.0](https://www.w3.org/TR/WCAG20/)


Tar utgangspunkt i denne kravlisten som oppfyller Nivå A krav:

1.1.1 Gi tekstalternativer til alt ikke-tekstlig innhold, slik at det kan konverteres til  f.eks stor skrift, blindeskrift, tale, symboler eller enklere språk.

1.2.1 Gi brukeren et alternativ når innholdet presenteres kun som video eller lyd

1.2.2 Tilby teksting for video med lyd.

1.3.1 Ting skal være kodet som det ser ut som. (tabeller, skjema)

1.3.2 Presenter innholdet i en meningsfull rekkefølge. (Meny, søkefunksjon, alfabetisk liste, nettsidekart)
 
1.3.3 Instruksjoner må ikke utelukkende være avhengig av form, størrelse, visuell plassering, orientering, eller lyd for å kunne bli forstått. (god koding, god visuell utforming, veiledningstekster, tydelige feilmeldinger)

1.4.1 Ikke bruk presentasjon som byggerutelukkende på farge.

1.4.2 Gi brukeren muligheten til å stoppe og pause lyd som begynner automatisk.

1.4.3 Kontrastforholdet mellom teksten og bakgrunnen er minst 4,5:1

1.4.4 Tekst kan bli endret til 200% størrelse uten tap av innhold eller funksjon.

1.4.5 Bruk tekst istedenfor bilder av tekst

2.1.1 All funksjonalitet skal kunne brukes kun ved hjelp av tastatur

2.1.2 Unngå tastaurfeller

2.2.1 Tidsbegrensninger skal kunne justeres av brukeren

2.2.2 Gi brukeren mulighet til å stoppe, pause eller skjule innhold som automatisk endrer seg.

2.3.1 Innhold skal ikke blinke mer enn tre ganger per sekund.

2.4.1 Gi brukeren mulighet til å hoppe direkte til hovedinnholdet.

2.4.2 Bruk nyttige og tydelige sidetitler.

2.4.3 Presenter innholdet i en logisk rekkefølge.

2.4.4 Alle lenkers mål og funksjon fremgår tydelig av lenketeksten.

2.4.5 Tilby brukeren flere måter å navigere på.

2.4.6 Sørg for at ledetekster og overskrifter er beskrivende.

2.4.7 Sørg for at alt innhold får synlig fokus når du navigerer med tastatur.

3.1.1 Sørg for at språket til innholdet på alle websider er angitt i koden.

3.1.2 Sørg for at alle deler av innholdet som er på et annet språk enn resten av siden er markert i koden.

3.2.1 Når en komponent kommer i fokus medfører dette ikke automatisk betydelige endringer i siden.

3.2.2 Endring av verdien til et skjemafelt medfører ikke automatisk betydelige endringer i siden.

3.2.3 Navigasjonslinker som gjentas på flere sider skal ha en konsekvent rekkefølge.

3.2.4 Elementer som har samme funksjonalitet på tvers av flere sider er utformet likt.

3.3.1 For feil som oppdages automatisk må du vise hvor feilen har oppstått og gi en tekstbeskrivelse av feilen.

3.3.2 Det vises ledetekster eller instruksjoner når du har skjemaelementer som må fylles ut.

3.3.3 Dersom feil blir oppdaget automatisk, gi brukeren et forslag til hvordan feilen kan rettes.

3.3.4 For sider som medfører juridiske forpliktelser må det være mulig å kunne angre, kontrollere eller bekrefte dataene som sendes inn.

4.1.1 Alle sider skal være uten store kodefeil.

4.1.2 Alle komponenter har navn og rolle bestemt i koden.

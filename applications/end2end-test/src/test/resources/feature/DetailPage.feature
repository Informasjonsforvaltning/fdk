@BRUKERHISTORIE_FDK_338
Feature: Detail page for presenting properties for a dataset.

  The page shall present selected properties for one dataset.
  Only properties that has an non-emty value shall be visible.
  The descriptive text shall be presented for kodes.
  Spatial area shall be presented with the name of the area and a klickable-link to it.

  Godkjenningskriterie: (gitt jeg er på detaljsiden)
   # jeg kan skifte språk mellom bokmål, nynorsk og engelsk
   # jeg får opp overskriftene: Kontaktinformasjon, Distrubusjon, Opplysninger, Restriksjoner, Formål, Relaterte, Kvalitet og Øvrig info
   # jeg kan se tittel, beskrivelse, utgiver og landingsside
   # jeg kan se katalogen datasettet opprinnelig er publisert i
   # jeg kan se alle feltene i datesettet som har verdier
   # jeg kan velge å laste ned datasettet i ulike formater
   # brukergrensesnittet skal være i henhold til wire-frames/CSS og godkjent av designer

  Background: Load dataset.
    Given I load the "dataset-detailpage.ttl" dataset.

##############################################
### IGNORED BECAUSE TEST FAILS TODO fix test or system ###
##############################################
#  @ignore
  Scenario: I can change language on the page - jeg kan skifte språk mellom bokmål, nynorsk og engelsk
    Given I change page-language to "Bokmål"
    Then the following dataset shall have the following norwegian properties (id, provenance, frequency, language, access-right, locations):
      | http://data.brreg.no/datakatalog/dataset/1 | Vedtak  | kontinuerlig | Norsk | Offentlig | Norge|
      | http://data.brreg.no/datakatalog/dataset/26 | Brukerinnsamlede data | | | Begrenset | Norge |
      | http://data.brreg.no/datakatalog/dataset/27 | Brukerinnsamlede data | | | Ikke-offentlig | Norge |
    Given I change page-language to "English"
    Then the following dataset shall have the following norwegian properties (id, provenance, frequency, language, access-right, locations):
      | http://data.brreg.no/datakatalog/dataset/1 | Governmental decisions  | continuous | Norwegian | Public | Norway|
      | http://data.brreg.no/datakatalog/dataset/26 | User collection | | | Restricted | Norway |
      | http://data.brreg.no/datakatalog/dataset/27 | User collection | | | Non-public | Norway |


  @TEST_FDK_312 @TESTSETT_FDK_313 @portal
  Scenario: C-Test FDK: jeg får opp overskriftene: Kontaktinformasjon, Distrubusjon, Opplysninger, Restriksjoner, Formål, Relaterte, Kvalitet og Øvrig info
    Given I change page-language to "Bokmål"
    When I open the detailpage of dataset "http://data.brreg.no/datakatalog/dataset/1"
    Then the following headings should be displayed:
      | Kontaktinformasjon    |
      | Distribusjon          |
      | Opplysninger          |
      | Restriksjoner         |
      | Formål                |
      | Relaterte             |
      | Kvalitet              |
      | Øvrig info            |


  @TEST_FDK_320 @TESTSETT_FDK_313 @portal
  Scenario: C-Test FDK: gitt jeg er på detaljsiden skal jeg se tittel, beskrivelse, utgiver og landingsside
    Given I change page-language to "Bokmål"
    When I open the detailpage of dataset "http://data.brreg.no/datakatalog/dataset/2"
    Then I see the following fields:
      | Tittel |
      | Beskrivelse |
      | Utgiver |
      | Landingsside |

##############################################
### IGNORED BECAUSE TEST FAILS TODO fix test or system ###
##############################################
#  @ignore
  @TEST_FDK_314 @TESTSETT_FDK_313 @portal
  Scenario: C-Test FDK: gitt jeg kan se alle feltene i datesettet som har verdier
    Given I change page-language to "Bokmål"
    When I open the detailpage of dataset "http://data.brreg.no/datakatalog/dataset/2"
    And all fields containing values should be displayed:
      | E-post            |
      | Telefon           |
      | Organisasjon      |
      | Emneord           |
      | Begrep            |
      | Tema              |
      | Restriksjon       |
      | Språk             |
      | Tidsperiode       |
      | Konformitet       |
      | Opprettet         |
      | Dekningsområde    |
    And the fields not containing any values should be hidden:
      | Sist endret       |
      | Tittel            |
      | I samsvar med     |
      | Beskrivelse       |
      | Format            |
      | Aksess-url        |
      | Formål            |
      | Relatert ressurs  |


  @TEST_FDK_331 @portal
  Scenario: C-Test FDK: gitt jeg er på detaljsiden da skal jeg kunne velge å laste ned datasettet i ulike formater
    Given I change page-language to "Bokmål"
    And I open the detailpage of dataset "http://data.brreg.no/datakatalog/dataset/1"
    Then I should be able to download the dataset in the following formats:
    | JSON-LD |
    | TURTLE |
    | RDF/XML |


  @TEST_UKJENT
  Scenario: Contact information should exist (Navn, E-post, Telefon, Organisasjon, Organisasjonsenhet)
    Given I change page-language to "Bokmål"
    Then the following datasets shall have contact information as specified:
      | http://data.brreg.no/datakatalog/dataset/1 | Informasjonstjenesten | aas@brreg.no | +4775007500 | Brønnøysundregistrene | AAS |
      | http://data.brreg.no/datakatalog/dataset/35 |  | mbox:postmottak@mattilsynet.no | +4722400000 |  | Mattilsynet |

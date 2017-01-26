Feature: Contact information for dataset.

  Background: Load dataset.
    Given I clean elastic search.
    And I load the "dataset-detailpage.ttl" dataset.
    And I open the browser.


  Scenario: Contact information should exist (Navn, E-post, Telefon, Organisasjon, Organisasjonsenhet)
Then the following datasets shall have contact information as specified:
| http://data.brreg.no/datakatalog/dataset/1 | Informasjonstjenesten | mailto:aas@brreg.no | tel:+4775007500 | Brønnøysundregistrene | AAS |
| http://data.brreg.no/datakatalog/dataset/35 |  | mbox:postmottak@mattilsynet.no | tel:+4722400000 |  | Mattilsynet |

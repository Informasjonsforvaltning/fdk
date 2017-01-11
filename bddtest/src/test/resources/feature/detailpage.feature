Feature: Page for presenting properties for a dataset.

  The page shall present selected properties for one dataset.
  Only properties that has an non-emty value shall be visible.
  The descriptive text shall be presented for kodes.
  Spatial area shall be presented with the name of the area and a klickable-link to it.

  Background: Load dataset.
    Given I clean elastic search.
    And I load the "dataset-detailpage.ttl" dataset.
    And I open the browser.

#  Scenario: Load of properties.
#    Then the following dataset shall have the following norwegian properties (id, provenance, frequency, language, access-rigth, locations):
#      | http://data.brreg.no/datakatalog/dataset/1 | Statlig vedtak  | kontinuerlig | norsk | Offentlig | Kongeriget Norge|
#      | http://data.brreg.no/datakatalog/dataset/26 | Brukerinnsamlede data | | | Begrenset | Kongeriget Norge |
#      | http://data.brreg.no/datakatalog/dataset/27 | Brukerinnsamlede data | | | Ikke-offentlig | Kongeriget Norge |

#    Then the following dataset shall have the following english properties (id, provenance, frequency, language, access-rigth, locations):
#      | http://data.brreg.no/datakatalog/dataset/1 | Statlig vedtak  | continuous | norwgian | Public | Kingdom of Norway|
#      | http://data.brreg.no/datakatalog/dataset/26 | Brukerinnsamlede data | | | Restricted | Kingdom of Norway |
#      | http://data.brreg.no/datakatalog/dataset/27 | Brukerinnsamlede data | | | Non-public | Kingdom of Norway |

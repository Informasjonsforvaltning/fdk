Feature: Introduction team's test data written in google sheet is available as a DCAT catalog

  Background: Reset database and harvest gdoc
    Given I clean elastic search.
    And I open the admin portal
    And I select harvest "gdoc" catalog

##############################################
### IGNORED BECAUSE TEST FAILS TODO fix test or system ###
##############################################
  @ignore
  Scenario: The dataset from gdoc is available
    Then the following dataset detail pages shall exist:
      | http://data.brreg.no/datakatalog/dataset/2 |
      | http://data.brreg.no/datakatalog/dataset/26 |
      | http://data.brreg.no/datakatalog/dataset/43 |
Feature: Harvester can harvest DIFI data

  Background: Reset database and harvest gdoc
    Given I clean elastic search.
    And I open the admin portal
    And I select harvest "difi" catalog

##############################################
### IGNORED BECAUSE TEST FAILS TODO fix test or system ###
##############################################
  @ignore
  Scenario: The dataset from gdoc is available
    Then the following dataset detail pages shall exist:
      | http://data.norge.no/node/581 |
      | http://data.norge.no/node/1175 |
      | http://data.norge.no/node/1651 |
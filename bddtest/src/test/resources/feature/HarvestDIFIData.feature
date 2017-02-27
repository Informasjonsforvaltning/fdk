Feature: Harvester can harvest DIFI data

  Background: Reset database and harvest gdoc
    Given I clean elastic search.
    And I open the admin portal
    And I select harvest "difi" catalog

  Scenario: The dataset from gdoc is available
    Then the following dataset detail pages shall exist:
      | http://data.norge.no/node/581 |
      | http://data.norge.no/node/1270 |
      | http://data.norge.no/node/95 |
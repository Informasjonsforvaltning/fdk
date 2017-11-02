Feature: Harvested datasets become visible in portal

  Scenario: Datasets from harvested catalog is available in search portal
    Given I start with empty elasticsearch index.
    When I open the admin portal
    And I select harvest "difi" catalog
    Then the following dataset detail pages shall exist in search portal:
      | http://data.norge.no/node/581 |
      | http://data.norge.no/node/1175 |
      | http://data.norge.no/node/1651 |
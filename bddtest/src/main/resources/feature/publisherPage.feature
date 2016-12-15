Feature: Page for presenting all Publishers.

  A page shall be created for presenting all Publishers defined in ElasticSearch.
  It shall contain a search-field and and three rows where the Publisher is evenly
  distribuated. Each Publisher shall bed presented as a clickable-link, as the name
  of the Publisher. The Page shall share header and footer with the theme and the
  result pages.
  Al bottom level Publisher presented shall have at least one dataset attached to it. The
  total number of datasets for each of the publisher shall be presented in brackets
  after the name. Non bottom level Publisher shall have the datasets number aggregated.

  Background: Load dataset and open homepage browser.
    Given I clean elastic search.
    And I load the dataset.
    And I open the Publisher page in the browser.

  Scenario Outline: Number of dataset for each Publisher shall be presented.
    Then <Publisher> shall have <Datasets>

    Examples:
    |Publisher|Datasets|
    |   |   |
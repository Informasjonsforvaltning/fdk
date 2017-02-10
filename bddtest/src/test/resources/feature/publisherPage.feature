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
    And I load the "dataset-w-distribution.ttl" dataset.
    And I open the Publisher page in the browser.

  Scenario: The following shall be available:
          1. All publisher that has at least one dataset or who has a child publisher with at least one dataset shall be presented.
          2. Each publisher shall be presented as a clickable link.
          3. The total number of datasets shall be presented for each Publisher.
          4. A search filed shall be present.
          5. A header and a footer shall be present.

    Then 41 publisher shall be present as clickable links.
    Then a search-field shall be present.
    Then the following Publisher and dataset aggregation shall exist:
      | ARBEIDS- OG SOSIALDEPARTEMENTET | 2  	|
      | ARBEIDSTILSYNET  				| 1 	|
      | ARBEIDS- OG VELFERDSETATEN 		| 1 	|
      | NÆRINGS- OG FISKERIDEPARTEMENTET| 22 	|
      | PATENTSTYRET 					| 2 	|
      | REGISTERENHETEN I BRØNNØYSUND 	| 20 	|
      |STAVANGER KOMMUNE				| 4 	|
      | MATTILSYNET						| 6 	|
      |DIREKTORATET FOR E-HELSE			| 10 	|
      |STATISTISK SENTRALBYRÅ			| 4 	|
      |SKATTEETATEN 					| 4		|
      |STATENS VEGVESEN					| 4		|
      |NORSK KULTURRÅD					| 2		|
      |PATENTSTYRET 					| 2		|
      |ARBEIDS- OG VELFERDSETATEN 		| 1		|


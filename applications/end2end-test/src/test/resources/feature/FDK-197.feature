#language: no
@BRUKERHISTORIE_FDK_197
Egenskap: Laste ned maskinlesbart resultatsett
 #Maskinlesbar grensesnitt for resultatsett- REST, json-ld, xml... (må følge dcat) Søket som data.
 #
 #1 start med ett datasett

 #gitt at jeg velger nedlasting så skal datasett lastes ned som fil og inneholde samme datasett som søket omfatter
  @TEST_FDK_256 @TESTSETT_FDK_273 @NOTREADY @NOTRUN
  Scenario: C-Test FDK: Nedlasting til fil av ønsket datasett
  Given I have made a search
  And have result dataset
  Then I should be able to download the dataset as a file
  And it should contain the same dataset as the search

 #gitt at søk er gjennomført så skal jeg se en mulighet til å laste ned søket på DCAT format
  @TEST_FDK_254 @TESTSETT_FDK_273 @NOTREADY @NOTRUN
  Scenario: C-Test FDK: Nedlastning DCAT format
  Given I have done a search
  Then I should be able to see that I can download the search in DCAT format

 #gitt at jeg ønsker å laste ned dataene så skal jeg ha en mulighet til å velge ønsket format (json-ld, turtle, RDF/XML (std. funksjonalitet i jena)
  @TEST_FDK_255 @TESTSETT_FDK_273 @NOTREADY @NOTRUN
  Scenario: C-Test FDK: Nedlasting av ulike format - json-ld
  Given I want to download data from the National Data Catalog
  Then I should be able choose the format json-ld
  And download it

 #gitt at jeg ønsker å laste ned dataene så skal jeg ha en mulighet til å velge ønsket format (json-ld, turtle, RDF/XML (std. funksjonalitet i jena)
  @TEST_FDK_267 @TESTSETT_FDK_273 @NOTREADY @NOTRUN
  Scenario: C-Test FDK: Nedlasting av ulike format - turtle
  Given I want to download data from the National Data Catalog
  Then I should be able choose the format turtle
  And download it

 #gitt at jeg ønsker å laste ned dataene så skal jeg ha en mulighet til å velge ønsket format (json-ld, turtle, RDF/XML (std. funksjonalitet i jena)
  @TEST_FDK_268 @TESTSETT_FDK_273 @NOTREADY @NOTRUN
  Scenario: C-Test FDK: Nedlasting av ulike format - RDF/XML
  Given I want to download data from the National Data Catalog
  Then I should be able choose the format RDF/XML
  And download it
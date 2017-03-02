Feature: Forbedringer design
  #@BRUKERHISTORIE_FDK_241
 #Godkjenningskriterier: (gitt jeg er på startsiden)
 ## topplinje med betversjon og lenke til epost for innspill
 ## jeg kan se alle temaene som avrundede labels og de er klikkbare
 ## jeg klikker på et tema og får opp resultat som er filtrert på temaet jeg trykket på
 ## jeg kan se en meny-ikon i øvre høyre hjørne
 ## jeg kan skrive inn søkeord og få opp filtrert resultat
 ## siden er i henhold til wireframes/CSS og godkjent av designer

  Background:
  Given Elasticsearch kjører
  And bruker datasett dataset-test.ttl
  And man har åpnet Fellesdatakatalog i en nettleser

 #gitt jeg er på startsiden skal det eksistere en topplinje med betversjon og lenke til epost for innspill
  @TEST_FDK_295 @TESTSETT_FDK_323
  Scenario: C-Test FDK: Forbedringer design - betaversjon
    Given I am on the homepage of the National Data Catalog
    Then "beta-versjon" shall appear in a topline
    And there should exist a link "tilbakemeldinger" for email input


 #gitt jeg er på startsiden kan jeg se alle temaene som avrundede labels og de er klikkbare
  #@TEST_FDK_296
  Scenario: C-Test FDK: Forbedringer design - theme labels
  Given I am on the homepage of the National Data Catalog
  Then I should see all the existing themes
  And I should be able to click on the 13 themes
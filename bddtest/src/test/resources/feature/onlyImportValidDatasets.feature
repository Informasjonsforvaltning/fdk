Feature: Endre valideringsrutine til å godkjenne lovlige datasett
  #Det skal være mulig å importere en datakatalog med datasett
  # som ikke har alvorlige feil. Dvs. datasett som bare har advarsler skal
  # importeres selv om det finnes datasett som ikke validerer.

	Background: :
		Given I open the Admin portal of the National Data Catalog in a browser
		Given I clean elastic search
		

	#gitt at systemet høster en katalog som innholder et datasett
	# med alvorlige feil så skal de datasettene som ikke inneholder
	# alvorlige feil importeres
	Scenario: Only the valid dataset from FDK-138 is available
		When I select harvest FDK-138 catalog
		Then the follown dataset detail pages shall exist:
		|http://data.brreg.no/datakatalog/dataset/2|
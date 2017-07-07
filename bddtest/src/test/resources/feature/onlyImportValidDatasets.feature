Feature: Endre valideringsrutine til å godkjenne lovlige datasett
  #Det skal være mulig å importere en datakatalog med datasett
  # som ikke har alvorlige feil. Dvs. datasett som bare har advarsler skal
  # importeres selv om det finnes datasett som ikke validerer.

	Background:
        Given I clean elastic search.
		

	#gitt at systemet høster en katalog som innholder et datasett
	# med alvorlige feil så skal de datasettene som ikke inneholder
	# alvorlige feil importeres

##############################################
### IGNORED BECAUSE TEST FAILS TODO fix test or system ###
##############################################
@ignore
Scenario: Only the valid dataset from FDK-138 is available
		Given I open the administration portal
		When I select harvest FDK-138 catalog
		Then the following dataset detail pages exists:
			|http://data.brreg.no/datakatalog/dataset/2|
		And the following dataset detail pages shall not exist:
			|http://data.brreg.no/datakatalog/dataset/1|
Feature: Forbedringer design
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

	#gitt jeg er på startsiden og jeg klikker på et tema og får opp resultat som er filtrert på temaet jeg trykket på
	#@TEST_FDK_297 @TESTSETT_FDK_323
##############################################
### IGNORED BECAUSE TEST FAILS TODO fix test or system ###
##############################################
#	@ignore
	Scenario: C-Test FDK: Forbedringer design - theme filtering
		Given I am on the homepage of the National Data Catalog
		When I click on theme "Energi"
		Then the result list should show 3 datasets
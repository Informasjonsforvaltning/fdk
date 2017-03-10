Feature: Design - detaljsiden
	#Vise samme felter som før. Kun bokmål.
	#
	#+ last ned knapp/lenke
	#+ feit katalog
	#+ felt identifier
	#
	#Godkjenningskriterie: (gitt jeg er på detaljsiden)
	## jeg får opp overskriftene: Kontaktinformasjon, Distrubusjon, Opplysninger, Restriksjoner, Formål, Relaterte, Kvalitet og Øvrig info
	## jeg kan se tittel, beskrivelse, utgiver og landingsside
	## jeg kan se katalogen datasettet opprinnelig er publisert i
	## jeg kan se alle feltene i datesettet som har verdier
	## jeg kan velge å laste ned datasettet i ulike formater 
	## brukergrensesnittet skal være i henhold til wire-frames/CSS og godkjent av designer

	Background:
		Given Elasticsearch kjører
		And bruker datasett dataset-detailpage.ttl
		And man har åpnet Fellesdatakatalog i en nettleser
		

	#gitt jeg er på detaljsiden da får jeg opp overskriftene: Kontaktinformasjon, Distribusjon, Opplysninger, Restriksjoner, Formål, Relaterte, Kvalitet og Øvrig info
	# @TEST_FDK_320 @TESTSETT_FDK_313 @portal
	Scenario: C-Test FDK: Design detaljsiden - tittel, beskrivelse, utgiver og landingsside
		When I open the dataset with id "http://data.brreg.no/datakatalog/dataset/1"
		Then the detailpage shall appear
		And display the following headers:
		
		| Kontaktinformasjon |
		| Konformitet |
		| Kvalitet |
		| Øvrig info |
		| Opplysninger |
		| Restriksjoner |
		| Formål |
		| Relaterte |
		
Feature: Opprette nytt datasett
	# @BRUKERHISTORIE_FDK_358
 	#Mulighet til å opprett nytt datasett
	#
	#Godkjenningskriterier:
	## På siden med oversikt over  datasett skal det eksistere en knapp for å opprette et nytt datasett
	## Når brukeren trykker på opprett-knappen, skal hun redirectes til en side der informasjon om datasettet spesifiseres.
	#
	#Tester:
	#Gitt at bruker har tilgang til å registrere på datakatalog
	#Når brukeren velger å opprette nytt datasett
	#Så skal datasett opprettes med id og knytning til datakatalogen
	#
	#Sjekk at bruker har tilgang til å endre <katalog-id>
	#PUT /catalog/<katalog-id>/dataset
	#-> HTTP 201 Created og dataset-id returneres
	#
	#Gitt at bruker prøver å registrere nytt datasett på datakatalog han ikke har tilgang til å redigere
	#så skal tjenesten returnere HTTP 401 Unauthorized
	#
	#PUT /catalog/<katalog-id>/dataset
	#-> HTTP 401 Unauthorized
	#
	# Brukergrensesnitt-test (ikke cucumber):
	#Sjekk at knapp eksisterer, og navigerer til redigeringsside

	#Godkjenningskriterier:
	## På siden med oversikt over  datasett skal det eksistere en knapp for å opprette et nytt datasett
	## Når brukeren trykker på opprett-knappen, skal hun redirectes til en side der informasjon om datasettet spesifiseres.
	@TEST_FDK_378
	Scenario: C-Test FDK: Opprette nytt datsett -  ikke tilgang
		Given Elasticsearch is running
		And webservice is running
		And a catalog exists
		When user try to register a new dataset in a catalog he has no access to
		Then status code HTTP 401 Unauthorized is returned
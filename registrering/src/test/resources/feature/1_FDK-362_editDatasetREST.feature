Feature: Redigere datasett
	# @BRUKERHISTORIE_FDK_362
 	# Mulighet til å redigere eksisterende datasett
	#
	#Godkjenningskriterier:
	## På siden med oversikt over  datasett skal det eksistere en knapp for å redigere et datasett
	## Når brukeren trykker på rediger-knappen, skal hun redirectes til en side der eksisterende informasjon om datasettet er preutfylt, og der informasjonen kan redigeres
	#
	#Tester:
	#Gitt at bruker har tilgang til å registrere på datakatalog
	#Når brukeren velger å redigere et datasett
	#Så skal datasett endres med oppdaterte data
	#
	#Sjekk at bruker har tilgang til å endre <katalog-id>
	#GET /catalog/<katalog-id>/dataset/<dataset->
	#-> HTTP 200 OK + data
	#POST eller PATCH /catalog/<katalog-id>/dataset/<dataset>
	#-> HTTP 200 OK
	#GET /catalog/<katalog-id>/dataset/<dataset->
	#-> HTTP 200 OK + oppdaterte data
	#
	#Gitt at bruker prøver å redigere et datasett på datakatalog han ikke har tilgang til å redigere
	#så skal tjenesten returnere HTTP 401 Unauthorized
	#GET /catalog/<katalog-id>/dataset/<ulovlig dataset-id>
	#-> HTTP 401 Unauthorized
	#
	#POST eller PATCH /catalog/<katalog-id>/dataset/<ulovlig dataset-id>
	#-> HTTP 401 Unauthorized
	#
	# Brukergrensesnitt-test (ikke cucumber):
	#Sjekk at knapp eksisterer, og navigerer til redigeringsside

	Background:
		Given Elasticsearch is running
		And webservice is running
		And a catalog exists
		

	#Godkjenningskriterier:
	## På siden med oversikt over datasett skal det eksistere en knapp for å redigere et datasett
	## Når brukeren trykker på rediger-knappen, skal hun redirectes til en side der eksisterende informasjon om datasettet er preutfylt, og der informasjonen kan redigeres
	@TEST_FDK_379
	Scenario: C-Test FDK: Redigere datasett - tilgang
		Given user has access to register in the catalog
		When a the user chooses to edit a dataset
		Then status code HTTP 200 OK is returned
		And the changed information is saved
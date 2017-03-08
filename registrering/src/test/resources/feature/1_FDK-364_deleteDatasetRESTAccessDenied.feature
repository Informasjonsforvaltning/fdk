Feature: Slette datasett
	# @BRUKERHISTORIE_FDK_364
	#Mulighet til å slette datasett
	#
	#Godkjenningskriterier:
	## På siden med oversikt over  datasett skal det eksistere en knapp for å slette et datasett
	## Når brukeren trykker på slett-knappen, skal det komme melding som ber brukeren bekrefte sletting. Hvis brukeren bekrefter, så slettes datasettet.
	#
	#Tester:
	#Gitt at bruker har tilgang til å registrere på datakatalog
	#Når brukeren velger å slette datasett
	#Så skal datasettet slettes
	#
	#Sjekk at bruker har tilgang til å endre <katalog-id>
	#DELETE /catalog/<katalog-id>/dataset/<dataset-id>
	#-> HTTP 200 OK
	#GET /catalog/<katalog-id>/dataset/<dataset-id>
	#-> HTTP 404 not found
	#
	#Gitt at bruker prøver å registrere nytt datasett på datakatalog han ikke har tilgang til å redigere
	#så skal tjenesten returnere HTTP 401 Unauthorized
	#
	#DELETE /catalog/<katalog-id>/dataset/<dataset-id>
	#-> HTTP 401 Unauthorized
	#
	#Brukergrensesnitt-test (ikke cucumber):
	#Sjekk at knapp eksisterer, og viser bekreftelse
	#Sjekk at slett ikke kalles dersom operasjonen ikke bekreftes

	Background:
		Given Elasticsearch is running
		And webservice is running
		And a catalog exists
		

	#Godkjenningskriterier:
	## På siden med oversikt over datasett skal det eksistere en knapp for å slette et datasett
	## Når brukeren trykker på slett-knappen, skal det komme melding som ber brukeren bekrefte sletting. Hvis brukeren bekrefter, så slettes datasettet
	@TEST_FDK_376
	Scenario: C-Test FDK: Slett datasett - ikke tilgang
		Given user try to delete a dataset in a catalog he has no access to
		Then status code HTTP 401 Unathorized is returned
Feature: Liste over datasett
	# @BRUKERHISTORIE_FDK_357
 	#liste med datasett m/status. Det må være tydelig om datasettet er publisert og hvem som sist redigerte datasettet og når.
	#
	#status: under arbeid, publisert
	#
	#Felter: tittel, kommentar, publiseringsstatus, tidspunkt
	#
	#godkjenningskriterie:
	#Gitt at jeg er pålogget en virksomhet som har datakatalog så kan jeg kan se listen over mine datasett med feltene: tittel, kommentar, status, tidspunkt
	#
	#Funksjonell test: Cucumber som tester REST grensesnittet.
	#Trenger en GUI test, men den må komme etterpå.

	Background:
		Given Elasticsearch is running
		And webservice is running
		And a catalog exists
		

	#Godkjenningskriterie:
	#Gitt at jeg er pålogget en virksomhet som har datakatalog så kan jeg kan se listen over mine datasett med feltene: tittel, kommentar, status, tidspunkt
	@TEST_FDK_367
	Scenario: C-Test FDK: Liste over datasett
		Given catalog contains the follwing datasets (title):
		| Enhetsregisteret |
		| Foretaksregisteret |
		Then I can see a list of my datasets with the values (title, last changed)
		| Enhetsregisteret | (creation date) |
		| Foretaksregisteret | (creation date) |
		
Feature: Automatisk harvesting
 #@BRUKERHISTORIE_FDK_353
 #Som dataeier ønsker jeg at min katalog skal høstes automatisk med faste intervall slik at det ikke krever manuell involvering for å få dataene inn i felles datakatalog.
 #
 #Godkjenningskriterier:
 ## Når harvester starter, høstes alle datasettene
 ## Gitt at harvesteren er oppe, starter innhøsting av alle datasett kl 01.00 hvert døgn
 ## Status for innhøsting skal vises i admin-grensesnittet.
 #
 #Testing:
 #Manuell eller på fast miljø:
 #Gitt at jeg er pålogget som test_admin i administrasjonsmodulen
 #så skal jeg se at alle harvest-jobbene har kjørt etter kl 01.00 i inneværende døgn
 #
 #Cucumber:
 #Gitt at harvester starter om 1 minutt og vi har registrert URL som skal høstes,
 #så kalles URL-en om ett minutt
 #og logg oppdateres
 #Godkjenningskriterier:
 ## Når harvester starter, høstes alle datasettene
 ## Gitt at harvesteren er oppe, starter innhøsting av alle datasett kl 01.00 hvert døgn
 ## Status for innhøsting skal vises i admin-grensesnittet.
 # @TEST_FDK_374

  Background:
    Given I have registered the following catalog-urls:
      | http://localhost:8097/catalog1 |
      | http://localhost:8097/catalog2 |
      | http://localhost:8097/catalog3 |


  Scenario: C-Test FDK: Automatic harvesting
    Given harvester starts
    Then the Urls are called

  Scenario: C-Test FDK: Scheduled harvesting
    Given harvester starts with scheduler set to once a minute
    Then the Urls are called

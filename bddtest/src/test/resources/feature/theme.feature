Feature: Datasett på temasiden

  Background: Testdatasett - dataset-test.ttl - Elasticsearch
    Given Elasticsearch kjører
    And bruker datasett dataset-test.ttl
    And man har åpnet Fellesdatakatalog i en nettleser

  Scenario Outline: C-Antall datasett på temasiden
    When jeg åpner temasiden i fellesdatakatalog
    Then vises alle '<tema>'
#    And <antall> datasett som inngår i hvert enkelt tema

    Examples:
      | tema | antall |
      | Jordbruk, fiskeri, skogbruk og mat | 4 |
      | Økonomi og finans | 4 |
      | Utdanning, kultur og sport | 4 |
      | Energi | 3 |
      | Miljø |4 |
      | Forvaltning og offentlig sektor | 49 |
      | Helse | 5 |
      | Internasjonale temaer | 7 |
      | Justis, rettssystem og allmenn sikkerhet | 3 |
      | Regioner og byer | 6 |
      | Befolkning og samfunn | 7 |
      | Vitenskap og teknologi | 3 |
      | Transport | 10 |
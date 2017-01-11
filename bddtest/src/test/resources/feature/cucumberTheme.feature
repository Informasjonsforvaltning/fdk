Feature: Link for filtering dataset on Theme 'Befolking og samfunn'
      
    When a user opens the start page for Fellesdatakatalog.
    He skal
    As a user
    I want to start Fellesdatakatalog
    So that I haven a theme link for 'Befolking og samfunn'

    Background: Open homepage browser.
        Given I have open the browser

    Scenario Outline: Theme exists
        When I open Fellesdatakatalog website
        Then link '<tema>' should exist

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
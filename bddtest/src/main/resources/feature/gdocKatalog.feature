Feature: Innføringsteamets testdata i google sheet er tilgjengelig som en DCAT-katalog

  Background: Endrer, konverterer og høster.

  Scenario: Det nye datasettet er tilgjengelig etter harvest
    Given Databasen er tom.
    And brukeren har lagt til nytt datasett med tittel "Test datasett" i google dokumentet
    And brukeren starter gdok-konverteringen
    And brukeren går inn i admin-grensesnittet og velger harvest 'gdok-katalog'
    When brukeren åpner portalen
    And søker etter "Test datasett".
    Then skal datasettet med tittel "Test datasett" finnes øverst på resultatsiden

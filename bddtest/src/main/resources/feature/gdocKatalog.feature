Feature: Innføringsteamets testdata i google sheet er tilgjengelig som en DCAT-katalog

  Background:
    Given brukeren har lagt til nytt datasett med tittel <title> google dokumentet
    And brukeren starter gdok-konverteringen
    And brukeren går inn i admin-grensesnittet og velger harvest 'gdok-katalog'

  Scenario: Det nye datasettet er tilgjengelig etter harvest
    When brukeren åpner portalen
    Then datasettet med tittel <title> skal finnes
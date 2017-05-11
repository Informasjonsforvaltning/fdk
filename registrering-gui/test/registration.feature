Feature: Basic registration functionality

    Background:
        Given I have logged into the registration application
        And I have selected Norwegian bokmål as page language

    Scenario: Register a new dataset for Frivillighetsregisteret
        Given I create a new dataset
        Given I set the the following fields (fieldName, content):
        | title | Frivillighetsregisteret |
        | description | Frivillighetsregisteret har oversikt over lag og foreninger i Norge, og har som formål å forenkle samhandlingen mellom frivillige organisasjoner og offentlig sektor. De som registrerer seg i Frivillighetsregisteret kan delta i grasrotandelen til Norsk Tipping, og motta/få momskompensasjon. |
        When I return to the catalog page
        Then I see the new dataset title "Frivillighetsregisteret" in the dataset overview


    Scenario: Modify contactInformation
        Given the dataset Frivillighetsregisteret is registered in the catalog
        And the dataset's contactPoint has email-field brreg@post.brreg.no
        When I open the dataset details
        And and identify the contact-information form
        And change the value of the email field to dig@brreg.no
        And refresh the page
        Then the contact-information field email is equal to dig@brreg.no


    Scenario: Add distribution to dataset Frivillighetsregisteret
        Given the dataset Frivillighetsregisteret is registered in the catalog
        Given the dataset has no distributions
        When I select the dataset
        And navigates to the distribution list
        And create a new distribution
        And set the following fields:
        | format | text/html|
        | description | Søke etter registrert frivillig organisasjon |
        | accessUrl   | http://w2.brreg.no/frivillighetsregisteret   |
        And I refersh the page
        Then the dataset has a new distribution with the corresponding values

    Scenario: Delete dataset Frivillighetsregisterert
        Given the dataset Frivillighetsregisterert is registrered in the catalog
        When I select the datasets delete icon and confirm delete
        Then the catalog list should be updated and the dataset removed from the list


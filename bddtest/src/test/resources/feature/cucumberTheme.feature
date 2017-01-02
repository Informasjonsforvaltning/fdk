Feature: Link for filtering dataset on Theme 'Befolking og samfunn'
      
    When a user opens the start page for Fellesdatakatalog.
    He skal
    As a user
    I want to start Fellesdatakatalog
    So that I haven a theme link for 'Befolking og samfunn'

    Background: Open homepage browser.
        Given I have open the browser

    Scenario: Theme Befolking og samfunn exists
        When I open Fellesdatakatalog website
        Then link befolking og samfunn should exist
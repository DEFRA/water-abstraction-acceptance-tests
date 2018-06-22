@readwrite @bs
Feature: [WATER-564] Rename licence
  As a business with a water abstraction licence
  I want to be able to check my licence details
  So that I know how much water I am licenced to abstract legally

  Background:
    Given I sign into my account as "internal_user"
    And I select a particular licence
    When I select the link to name the licence

  Scenario: [WATER-564] Reset licence name
    When I reset the licence name
    Then the expected licence name appears on the licence summary page

  Scenario: [WATER-564] Cancel licence rename
    When I select the Cancel link
    Then the expected licence name appears on the licence summary page

  Scenario: [WATER-564] Invalid licence rename
    When I enter a licence name which is invalid
    Then I see an error message telling me the name is invalid
    And the expected licence name appears on the licence summary page

  Scenario: [WATER-564] Valid licence rename
    When I enter a valid licence name
    Then the expected licence name appears on the licence summary page
    And the licence name is searchable on the abstraction licences page
    And all licences containing that term are shown on screen

  Scenario: [WATER-564] Reset licence name
    When I reset the licence name
    Then the expected licence name appears on the licence summary page

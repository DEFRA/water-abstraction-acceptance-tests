@readwrite
Feature: Rename licence
  As a business with a water abstraction licence
  I want to be able to check my licence details
  So that I know how much water I am licenced to abstract legally

  Background:
    Given I sign into my account as "water_user1"
    And I select "18/54/13/0381"
    When I select the "Name this licence" link

  Scenario: Cancel licence rename
    When I select the Cancel link
    Then the expected licence name appears on the licence summary page

  Scenario: Invalid licence rename
    When I enter a licence name which is invalid
    Then I see an error message telling me the name is invalid
    And the expected licence name appears on the licence summary page

  Scenario: Valid licence rename
    When I enter a valid licence name
    Then the expected licence name appears on the licence summary page
    And the licence name is searchable on the abstraction licences page
    And all licences containing that term are shown on screen

  Scenario: Reset licence name
    When I reset the licence name
    Then the expected licence name appears on the licence summary page

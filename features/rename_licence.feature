@test @rename @preprod
Feature: [WATER-564] Rename licence
  As a business with a water abstraction licence
  I want to be able to check my licence details
  So that I know how much water I am licenced to abstract legally

  Background:
    Given I am on the sign in page
    And I sign into my account as "external_user"
    When I start renaming a licence

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

  Scenario: [WATER-564] Reset licence name
    When I reset the licence name
    Then the expected licence name appears on the licence summary page

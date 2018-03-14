@basic @readonly @bs
Feature: Basic licence checks
  As a business with a water abstraction licence
  I want to be able to check my licence details
  So that I know how much water I am licenced to abstract legally

  Background:
    Given I sign into my account as "water_user1"
    And I access the first licence

  Scenario: Contact details are shown for licence
    When I check the licence contact details
    Then I am on the contact details page

  Scenario: Licence points are shown for licence
    When I check the licence points
    Then I am on the licence points page

  Scenario: Licence purposes are shown for licence
    When I check the licence purposes
    Then I am on the licence purposes page

  Scenario: Licence conditions are shown for licence
    When I check the licence conditions
    Then I am on the licence conditions page

@frontoffice
Feature: Check licence details
  As a business with a water abstraction licence
  I want to be able to check my licence details
  So that I know how much water I am licenced to abstract legally

  Background:
    Given I sign into my account
    And I select "18/54/13/0381"

  Scenario: Contact details are shown for licence
    When I check the licence contact details
    Then I am on the contact details page

  Scenario: Licence terms are shown for licence
    When I check the licence terms
    Then I am on the licence terms page

  Scenario: Licence terms details are displayed when selected from the licence terms page
    When I check the licence terms
    And I individually select each licence
    Then I can see all my licence term details

@basic @readonly @bs
Feature: [WATER-1] Basic licence checks
  As a business with a water abstraction licence
  I want to be able to check my licence details
  So that I know how much water I am licenced to abstract legally

  Background:
    Given I am on the sign in page
    And I sign into my account as "internal_user"
    When I access the first licence
    Then I am on the licence details page

  Scenario: [WATER-78] Details are shown for licence
    When I check the licence contact details
    Then I am on the contact details page

    When I check the licence points
    Then I am on the licence points page

    When I check the licence purposes
    Then I am on the licence purposes page

    When I check the licence conditions
    Then I am on the licence conditions page

@readonly @bs
Feature: [WATER-1049] Check flows and levels
  As a water abstraction licence holder
  I want to check the flow or level data
  So that I can abstract water legally

  Background:
    Given I sign into my account as "internal_user"

  Scenario: [WATER-1090] Show flow
    When I select a licence with a "flow" condition
    Then I can see the correct "flow" data
    And I can convert the units

  Scenario: [WATER-1090] Show level
    When I select a licence with a "level" condition
    Then I can see the correct "level" data

  Scenario: [WATER-1090] No data available
    When I select a licence with a "no_data" condition
    Then I can see the correct "no_data" data

  Scenario: [WATER-1090] No gauging station link
    When I select a licence with a "no_station" condition
    Then I cannot see a flow or level data link

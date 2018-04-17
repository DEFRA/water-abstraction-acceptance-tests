@readonly @bs
Feature: [WATER-563] Search and filter on licences page

Background:
  Given I sign into my account as "water_user1"
  And I am on the internal abstraction licences page

Scenario: [WATER-563] Search by licence number
  When I search for a partial licence number
  Then all licences containing that term are shown on screen

Scenario: [WATER-563] Search by licence name
  When I search for a partial licence name
  Then all licences containing that term are shown on screen

Scenario: [WATER-563] Invalid search
  When I enter a search term which does not exist on screen
  Then I cannot see any licences

Scenario: [WATER-563] Remove search term
  When I search for a partial licence name
  And I remove a search term
  Then I can see the original number of licences

Scenario: [WATER-526] Sort licences by name
  When I select the licence name heading
  Then the table is sorted by licence name in ascending order

Scenario: [WATER-526] Sort licences by end date
  When I select the end date heading
  Then the table is sorted by end date in ascending order

Scenario: [WATER-526] Sort licences by number
  When I select the licence name heading
  And I select the licence number heading
  Then the table is sorted by licence number in ascending order

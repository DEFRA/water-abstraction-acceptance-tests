@readonly @bs
Feature: [WATER-563] Search and filter on licences page

Background:
  Given I am on the sign in page
  And I sign into my account as "internal_user"
  And I am on the internal abstraction licences page

Scenario: [WATER-922] Invalid licences
  When I search for an "expired" licence
  Then I cannot see any licences

  When I search for a "revoked" licence
  Then I cannot see any licences

  When I search for a "lapsed" licence
  Then I cannot see any licences

  When I search for a "future" licence
  Then I cannot see any licences

Scenario: [WATER-978] Pagination
  When I select a second page of many licences
  Then I can see a full page of licences
  And I can see the correct number of pagination links

Scenario: [WATER-526] Sort licences
  When I select the licence name heading
  And I select the licence number heading
  Then the table is sorted by licence number in ascending order

  When I select the licence name heading
  Then the table is sorted by licence name in ascending order

  When I select the end date heading
  Then the table is sorted by end date in ascending order

Scenario: [WATER-563] Search by licence number
  When I search for a partial licence number
  Then all licences containing that term are shown on screen

  When I search for a partial licence name
  Then all licences containing that term are shown on screen

  When I enter a search term which does not exist on screen
  Then I cannot see any licences

Scenario: [WATER-563] Remove search term
  When I search for a partial licence name
  And I remove a search term
  Then I can see the original number of licences

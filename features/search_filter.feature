@frontoffice
Feature: Search and filter on licences page

Background:
  Given I sign into my account as "water_user1"
  And I am on the abstraction licences page

Scenario: Search by licence number
  When I search for a partial licence number
  Then all licences containing that term are shown on screen

Scenario: Search by licence name
  When I search for a partial licence name
  Then all licences containing that term are shown on screen

Scenario: Invalid search
  When I enter a search term which does not exist on screen
  Then I cannot see any licences

Scenario: Remove search term
  When I search for a partial licence name
  And I remove a search term
  Then I can see the original number of licences

Scenario: Sort licences by name
  When I select the licence name heading
  Then the table is sorted by licence name in ascending order

Scenario: Sort licences by number
  When I select the licence name heading
  And I select the licence number heading
  Then the table is sorted by licence number in ascending order

Scenario: Filter licences by email address
  When I enter an email address on the licence holder's email field
  Then all licences containing that term are shown on screen

@test @basic @preprod @prod
Feature: [WATER-420] Basic login
  As a business with water abstraction licences
  I want to be given help when I have problem signing into my account
  So that I'm able to view my licences

  Scenario: [WATER-420] Valid login
    Given I am on the sign in page for "internal_user"
    When I sign into my account as "internal_user"
    Then I am on the internal abstraction licences page

@basic @readonly @bs
Feature: Basic login
  As a business with water abstraction licences
  I want to be given help when I have problem signing into my account
  So that I'm able to view my licences

  Scenario: Incorrect password prompts reentering sign in details
    Given I am on the sign in page
    When I enter my password incorrectly
    Then I am informed "Your email address or password is incorrect"

  Scenario: Request password reset
    Given I am on the sign in page
    When I request a password reset
    Then I am on the Check Your Email page

  Scenario: Valid login
    Given I am on the sign in page
    When I sign into my account as "water_user1"
    Then I am on the internal abstraction licences page

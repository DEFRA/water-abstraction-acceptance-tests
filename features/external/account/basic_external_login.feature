@test @basic @preprod @prod
Feature: [WATER-420] Basic login
  As a business with water abstraction licences
  I want to be given help when I have problem signing into my account
  So that I'm able to view my licences

#  Background:
#    Given I am on the sign in page

  Scenario: [WATER-420] Incorrect password prompts reentering sign in details
    Given I am on the sign in page for "external_user"
    When I enter my password incorrectly
    # Then I am informed "Re-enter your email address"
   Then I am informed "Check your email address"

  Scenario: [WATER-420] Blank email and password gives error message
    Given I am on the sign in page for "external_user"
    When I enter blank details
    # Then I am informed "Re-enter your password"
   Then I am informed "Enter an email address"

  Scenario: [WATER-444] Request password reset
    Given I am on the sign in page for "external_user"
    When I request a password reset as an "external_user"
    Then I am on the Check Your Email page

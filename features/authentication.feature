@frontoffice 
Feature: Identity management
  As a business with water abstraction licences
  I want to be given help when I have problem signing into my account
  So that I'm able to view my licences

  Background:
    Given I am in the sign in page

  Scenario: Incorrect password prompts reentering sign in details
    When I enter my password incorrectly
    Then I am informed "Your email address or password are incorrect"

  Scenario: Invalid sign in causes account to be locked and email sent to account holder informing them
    Given I lock my account by attempting to sign in with an incorrect password too many times
     When I unlock my account using the email link provided
     Then I can sign into my account

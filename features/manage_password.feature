@frontoffice
Feature: Manage password
  As a viewer of water abstraction licences
  I want to update my password
  So that I can sign in securely

  Background:
    Given I sign into my account
    And I select Change Password

  Scenario: Enter invalid passwords
    When I enter a password which is too short
    Then I see an error telling me the password is invalid

    When I enter a password with no uppercase letters
    Then I see an error telling me the password is invalid

    When I enter a password with no symbols
    Then I see an error telling me the password is invalid

    Then I sign into my account

  Scenario: Enter valid password
    When I enter a valid password
    Then I see the Password Changed screen

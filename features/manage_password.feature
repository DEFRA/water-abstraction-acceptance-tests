@readonly @bs
Feature: [WATER-437] Manage password
  As a viewer of water abstraction licences
  I want to update my password
  So that I can sign in securely

  Background: Go to Change Password screen
    Given I sign into my account as "water_user1"
    And I select Change Password
    When I enter my correct password
    Then I am on the Change Password page

  Scenario: [WATER-437] Enter short password
    When I enter a password which is too short
    Then I see an error telling me the password is invalid

  Scenario: [WATER-437] Enter lowercase password
    When I enter a password with no uppercase letters
    Then I see an error telling me the password is invalid

  Scenario: [WATER-437] Enter password with no symbols
    When I enter a password with no symbols
    Then I see an error telling me the password is invalid

  Scenario: [WATER-437] Enter non-matching passwords
    When I enter valid passwords which don't match
    Then I see an error telling me the passwords don't match

  Scenario: [WATER-437] Sign in with existing password to show that it hasn't been changed
    Given I am on the sign in page
    When I sign into my account as "water_user1"
    Then I am on the internal abstraction licences page

  Scenario: [WATER-437] Enter valid password
    When I enter a valid password
    Then I see the Password Changed screen

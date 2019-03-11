@test @password
Feature: [WATER-437] Manage password
  As a viewer of water abstraction licences
  I want to update my password
  So that I can sign in securely

  Background:
    Given I am on the sign in page

  Scenario: [WATER-471] Password reset
    When I request a password reset as an "external_user"
    Then I can reset my password
    And I am on the external abstraction licences page

  Scenario: [WATER-447] Password lock out
    When I lock my account by attempting to sign in with an incorrect password "10" times
    Then I unlock my account using the email link provided
    And I am on the external abstraction licences page

    Given I am on the sign in page
    When I enter a correct password between incorrect attempts
    Then I am on the external abstraction licences page

  Scenario: [WATER-437] Enter incorrect passwords
    Given I sign into my account as "external_user"
    And I select Change Password
    And I enter my correct password
    And I am on the Change Password page

    When I enter a password which is too short
    Then I see an error telling me the password is invalid

    When I enter a password with no uppercase letters
    Then I see an error telling me the password is invalid

    When I enter a password with no symbols
    Then I see an error telling me the password is invalid

    When I enter valid passwords which don't match
    Then I see an error telling me the passwords don't match

    When I enter a valid password
    Then I see the Password Changed screen

  Scenario: [WATER-437] Sign in with existing password to show that it hasn't been changed
    When I sign into my account as "external_user"
    Then I am on the external abstraction licences page

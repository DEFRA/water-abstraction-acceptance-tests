@use-internal-test-data @notifications
Feature: Internal user is able to send paper forms

  As an internal user
  I want to be able to send paper forms
  So that licence holders without an account on the service can submit their returns

  Scenario: User can send paper forms for a licence with due returns
    Given I logged in as "billing_and_data" user
    And I navigate to the "Manage" section
    And I navigate to the "paper forms" page
    When I submit "valid" licence number
    Then I can see the paper forms "success" page

  Scenario: User can't send paper forms for a licence without due returns
    Given I logged in as "wirs" user
    And I navigate to the "Manage" section
    And I navigate to the "paper forms" page
    When I submit "invalid" licence number
    Then I can see the paper forms "issues" page

  Scenario: Submitting a blank form results in validation errors
    Given I logged in as "super" user
    And I navigate to the "Manage" section
    And I navigate to the "paper forms" page
    When I submit an empty form
    Then the send paper forms page displays validation errors

  Scenario Outline: Users without billing and data or wirs permission can't send paper forms
    Given I logged in as <user> user
    When I navigate to the "Manage" section
    Then I can't see the "paper forms" link
    Examples:
      | user                |
      | nps                 |
      | psc                 |
      | environment_officer |

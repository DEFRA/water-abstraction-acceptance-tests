@use-internal-test-data @notifications
Feature: Internal user is able to send paper forms

  As an internal user
  I want to be able to send paper forms
  So that licence holders without an account on the service can submit their returns

  Scenario Outline: User can send paper forms for a licence with due returns
    Given I logged in as <user> user
    And I navigate to the "Manage" section
    When I submit "valid" licence number
    Then I can see the paper forms "success" page
    Examples:
      | user             |
      | billing_and_data |

Scenario Outline: User can't send paper forms for a licence without due returns
    Given I logged in as <user> user
    And I navigate to the "Manage" section
    When I submit "invalid" licence number
    Then I can see the paper forms "issues" page
    Examples:
      | user             |
      | billing_and_data |


# Scenario: Send paper return forms page validation


# Scenario: Users without billing and data or WIRS permission can't send paper forms

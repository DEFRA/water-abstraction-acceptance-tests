@use-internal-test-data @notifications
Feature: Internal user is able to send returns reminders

  As an internal user
  I want to be able to send returns reminders
  So that I can remind licence holders to complete their returns

  Scenario Outline: User can send returns reminders to relevant licences
    Given I logged in as "billing_and_data" user
    And I navigate to the "Manage" section
    And I navigate to the "returns reminders" page
    When I exclude <licence> licences
    Then I can see the "returns reminders" waiting page
    And I can confirm sending the "returns reminders"
    And I can see the "return reminders" success page
    Examples:
      | licence |
      | no      |
      | some    |

  Scenario Outline: Users without billing and data permission can't send returns reminders
    Given I logged in as <user> user
    And I navigate to the "Manage" section
    Then I can't see the "returns reminders" link
    Examples:
      | user                |
      | wirs                |
      | nps                 |
      | psc                 |
      | environment_officer |

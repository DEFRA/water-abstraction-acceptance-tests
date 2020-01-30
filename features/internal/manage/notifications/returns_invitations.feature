@use-internal-test-data @notifications
Feature: Internal user is able to send returns invitations

  As an internal user
  I want to be able to send returns invitations
  So that I can invite licence holders to complete their returns

  Scenario Outline: User can send returns invitations to relevant licences
    Given I logged in as "billing_and_data" user
    And I navigate to the "Manage" section
    And I navigate to the "returns invitations" page
    When I exclude <licence> licences
    Then I can see the "returns invitations" waiting page
    And I can confirm sending the "returns invitations"
    And I can see the "return invitations" success page
    Examples:
      | licence |
      | no      |
      | some    |

  Scenario Outline: Users without billing and data permission can't send returns invitations
    Given I logged in as <user> user
    And I navigate to the "Manage" section
    Then I can't see the "returns invitations" link
    Examples:
      | user                |
      | wirs                |
      | nps                 |
      | psc                 |
      | environment_officer |

@test @digitise
Feature: [WATER-1015] Edit licence
  As an internal user
  I want to propose changes to licences
  So that licence holders receive a consistent service

  Background:
    Given I am on the sign in page
    And I sign into my account as "ar_user"
    And I propose changes to a licence

  Scenario: [WATER-1015] Reject licence changes
    When I sign into my account as "ar_approver"
    And I reject the changes
    Then the change is shown as "In progress"

  Scenario: [WATER-1015] Review and approve licence changes
    When I sign into my account as "ar_approver"
    And I mark the licence for review
    Then the change is shown as "Licence review"

    When I approve the changes
    Then the change is shown as "Approved"

    * I reset a licence back to in progress

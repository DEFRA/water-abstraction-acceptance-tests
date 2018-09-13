@readwrite @admin
Feature: Refresh test environment

  Scenario: Refresh data
    Given I have no registered licences for "refresh"
    And I am on the sign in page

    Given I sign into my account as "external_user"
    And I am on the add licences page
    When I register a licence for "refresh"
    Then an admin user can read the code

    Given I sign into my account as "external_user"
    When I enter my confirmation code
    Then I am on the external abstraction licences page
    And I select a licence I registered

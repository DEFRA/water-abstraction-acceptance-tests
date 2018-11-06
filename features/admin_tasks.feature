@reset
Feature: Reset test environment

  Scenario: Refresh data
    Given I have no registered licences for "registration"
    And I have no registered licences for "refresh"
    And I am on the sign in page

    Given I sign into my account as "external_user"
    And I am on the add licences page
    When I register a licence for "refresh"
    Then an admin user can read the code

    Given I sign into my account as "external_user"
    When I enter my confirmation code
    Then I am on the external abstraction licences page
    And I select a licence I registered

    Given I sign into my account as "returns_user"
    And I am on the add licences page
    When I register a licence for "returns"
    Then an admin user can read the code

    Given I sign into my account as "returns_user"
    When I enter my confirmation code
    Then I am on the external abstraction licences page
    And I select a licence I registered

    # Add a 'submit a return' step

  Scenario: Back end permissions
    Given I am on the sign in page

    When I access the back end as "internal_user"
    Then I can see the back end page

    # The following test will fail because the user can't log in.
    # This is intentional and not part of the main test suite.
    When I access the back end as "external_user"
    Then I cannot see the back end page

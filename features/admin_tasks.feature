@reset
Feature: Reset test environment

  Scenario: Refresh data
    * I have no registered licences for "registration"
    * I have no registered licences for "refresh"
    * I have no registered licences for "returns"
    * I am on the sign in page

    * I sign into my account as "external_user"
    * I am on the add licences page
    * I register a licence for "refresh"
    * an admin user can read the code

    * I sign into my account as "external_user"
    * I enter my confirmation code
    * I am on the external abstraction licences page
    * I select a licence I registered

    * I sign into my account as "returns_user"
    * I am on the add licences page
    * I register a licence for "returns"
    * an admin user can read the code

    * I sign into my account as "returns_user"
    * I enter my confirmation code
    * I am on the external abstraction licences page
    * I select a licence I registered

    * I am on the sign in page
    * I sign into my account as "ar_approver"
    * I reset a licence back to in progress

  Scenario: Back end permissions
    * I am on the sign in page

    * I access the back end as "internal_user"
    * I can see the back end page

    # The following test will fail because the user can't log in.
    # This is intentional and not part of the main test suite.
    * I access the back end as "external_user"
    * I cannot see the back end page

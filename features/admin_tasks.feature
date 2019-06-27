@test @reset
Feature: Reset test environment

 This feature refreshes all the data used for the purposes below.
 It does not need running every cycle, only if the test data for automation has been unexpectedly changed.
 It assumes that the accounts used for each test have already been set up manually on each environment.

  Scenario: Refresh data
    * I have no registered licences for "registration"
    * I have no registered licences for "refresh"
    * I have no registered licences for "returns"
    * I have no registered licences for "switching companies"
    * I am on the sign in page

    * I sign into my account as "external_user"
    * I am on the add licences page
    * I register a licence for "refresh"
    * an admin user can read the code

    * I am on the sign in page for "external_user"
    * I sign into my account as "external_user"
    * I enter my confirmation code
    * I am on the external abstraction licences page
    * I revoke access to view my licences

    * I sign into my account as "returns_user"
    * I am on the add licences page
    * I register a licence for "returns"
    * an admin user can get the last verification code for the "external_user" user

    * I am on the sign in page for "external_user"
    * I sign into my account as "returns_user"
    * I enter my confirmation code
    * I am on the external abstraction licences page
    * I sign out
    * I am on the sign in page for "external_user"
    * I sign into my account as "external_user_2"
#    * I am on the add licences page
    * I register a licence for "switching companies"
    * an admin user can read the code

    * I am on the sign in page for "external_user"
    * I sign into my account as "external_user_2"
    * I enter my confirmation code
    * I am on the external abstraction licences page
    * I revoke access to view my licences

    * I am on the sign in page for "internal_user"
    * I sign into my account as "ar_approver"
    * I reset a licence back to in progress

  @skip_scenario
  Scenario: Back end permissions
    * I am on the sign in page

    * I access the back end as "internal_user"
    * I can see the back end page

    # The following test will fail because the user can't log in.
    # This is intentional and not part of the main test suite.
    * I access the back end as "external_user"
    * I cannot see the back end page

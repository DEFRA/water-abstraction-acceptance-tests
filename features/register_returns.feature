@readwrite
Feature: [WATER-528 and 560] Register and share
  As a user with a water abstraction licence
  I want to register with the service
  So that I can view my licence and share access with my agent

  # Scenario names are commented out to avoid clearing out variables.
  # Future version of these tests to separate out the registration test
  # and use static data for remaining tests.

Scenario: [WATER-528 and 560] Register and share licences
  Given I am a new user
  When I register my email address on the service
  Then I receive an email with sign in details
  And I sign in with my new email address

  Given I am on the add licences page
  When I register a licence
  Then an admin user can read the code

  Given I sign in with my new email address
  When I enter my confirmation code
  Then I am on the external abstraction licences page
  And I select a licence I registered

# Scenario: [WATER-563] Search by licence holder
  Given I sign into my account as "internal_user"
  When I enter an email address on the licence holder's email field
  Then all licences containing that term are shown on screen

# Scenario: [WATER-560] Share access
  Given I sign in with my new email address
  When I add an agent to view my licences
  Then the agent can log in and view the licences I registered

# Scenario: [WATER-565] Revoke access
  Given I sign in with my new email address
  When I remove an agent to view my licences
  Then the agent cannot view the licences I registered

# Scenario: [WATER-1258] View returns history (external user)
  Given I sign in with my new email address
  When I can access my returns overview
  Then I can view a return that is "populated daily"
  And I can't see the NALD reference
  And I can check the licence details
  And I can view a return that is "nil"

# Scenario: [WATER-1376] View returns link (external user)
  Given I sign in with my new email address
  When I select a licence I registered
  Then I can view all returns for my licence
  And the earliest return date is not earlier than the current version start date
  And I can view a return that is "the most recent"

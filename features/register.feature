@test @register
Feature: [WATER-528 and 560] Register and share
  As a user with a water abstraction licence
  I want to register with the service
  So that I can view my licence and share access with my agent

Scenario: [WATER-528] Register licences
  Given I have no registered licences for "registration"
  When I register my email address on the service
  Then I sign in with my new email address

  Given I am on the add licences page
  When I register a licence for "registration"
  Then an admin user can read the code

  Given I sign in with my new email address
  When I enter my confirmation code
  Then I am on the external abstraction licences page
  And I select a licence I registered

Scenario: [WATER-563] Search by licence holder
  Given I am on the sign in page
  And I sign into my account as "internal_user"
  When I enter an email address on the licence holder's email field
  Then the correct search results are shown

Scenario: [WATER-560 and 565] Share and revoke access
  # External_user must have not already granted access to another user for these steps to work.
  Given I am on the sign in page
  And I sign into my account as "external_user"
  When I add an agent to view my licences
  Then the agent can log in and view a licence I can access

  Given I sign into my account as "external_user"
  When I remove an agent to view my licences
  Then the agent cannot view any licences I own

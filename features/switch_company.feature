@test @switch
Feature: [WATER-1432] Switch companies
  As an agent
  I want to manage different companies' licences
  So that I can help my clients

Background:
  Given I am on the sign in page
  And I sign into my account as "external_user"
  And I add an agent to view my licences
  And I sign into my account as "external_user_2"
  And I add the same agent to view my licences

  # This relies on two companies having granted access to an agent to manage their licences.

Scenario: [WATER-1432] Switch companies
  When the agent for multiple licences logs in
  Then that agent can switch between those companies' licences

  # The agent then needs to be removed from both licences.

  * I sign into my account as "external_user"
  * I revoke access to view my licences
  * I sign into my account as "external_user_2"
  * I revoke access to view my licences

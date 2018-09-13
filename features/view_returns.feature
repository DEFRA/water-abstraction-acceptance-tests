@readwrite
Feature: [WATER-1258] View returns history
  As a user with a water abstraction licence
  I want to see what I have abstracted in previous years
  So that I can ensure my current licence is appropriate

Background:
  Given I am on the sign in page

Scenario: [WATER-1258] View returns history (external user)
  Given I sign into my account as "external_user"
  When I can access my returns overview
  Then I can view a return that is "populated daily"
  And I can't see the NALD reference
  And I can check the licence details
  And I can view a return that is "nil"

Scenario: [WATER-1376] View returns link (external user)
  Given I sign into my account as "external_user"
  When I select a licence I own
  Then I can view all returns for my licence
  And the earliest return date is not earlier than the current version start date
  And I can view a return that is "the most recent"

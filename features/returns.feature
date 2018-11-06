@test @returns
Feature: [WATER-1258] [WATER-1352] View and edit returns
  As a user with a water abstraction licence
  I want to see what I have abstracted in previous years
  So that I can ensure my current licence is appropriate

  As an internal user
  I want to edit a user's return
  So that I can correct any errors in our database

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
  When I select a licence I can access
  Then I can view all returns for the licence
  And I can view a return that is "the most recent"

Scenario: [WATER-1352] Edit returns (internal user)
  Given I sign into my account as "internal_user"

  When I "edit" a return of type "nil"
  Then I can view the return I just submitted

  When I "edit" a return of type "volume"
  Then I can view the return I just submitted

  When I "edit" a return of type "one meter"
  Then I can view the return I just submitted

  When I "edit" a return of type "multi meter"
  Then I can view the return I just submitted

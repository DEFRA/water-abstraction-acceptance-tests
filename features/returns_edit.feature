@test @returns_edit
Feature: [WATER-1352] Edit returns
  As an internal user
  I want to edit a user's return
  So that I can correct any errors in our database

Background:
  Given I am on the sign in page

Scenario: [WATER-1352] Edit returns (internal user)
  Given I sign into my account as "internal_user"

  When I "edit" a return of type "nil"
  Then I can view the return I just submitted

# Uncomment the following once complete

  # When I "edit" a return of type "volume"
  # Then I can view the return I just submitted
  #
  # When I "edit" a return of type "one meter"
  # Then I can view the return I just submitted
  #
  # When I "edit" a return of type "multi meter"
  # Then I can view the return I just submitted

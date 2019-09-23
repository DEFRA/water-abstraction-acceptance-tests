@test @search @preprod @prod
Feature: [WATER-563] Search for things

Background:
  Given I am on the sign in page for "internal_user"
  And I sign into my account as "internal_user"
  And I am on the internal abstraction licences page

Scenario: [WATER-526 and 563] Search licences
  When I search for a partial licence number
  Then the correct search results are shown

  When I search for a partial licence name
  Then the correct search results are shown

  When I enter a search term which does not exist on screen
  Then I cannot see any licences

  When I search for a partial licence name
  And I remove a search term
  Then I can see the original number of licences

Scenario: [WATER-1831] Search for a return
  When I search for a return
  Then the correct search results are shown
  And the search results contain a link to the return

Scenario: Search for external user
  When I search for an "external_user"
  Then the correct search results are shown
  And I can access the user details


# Scenario: Search for internal user
#   When I search for an "internal_user"
#   Then the correct search results are shown
#   And I can access the user details

Scenario: [WATER-922] Licence sanity check
  When I select a second page of many licences
  Then I can see a full page of licences
  And I can see the correct number of pagination links

  When I search for an "expired" licence
  Then I cannot see any licences

  When I search for a "revoked" licence
  Then I cannot see any licences

  When I search for a "lapsed" licence
  Then I cannot see any licences

  When I search for a "future" licence
  Then I cannot see any licences

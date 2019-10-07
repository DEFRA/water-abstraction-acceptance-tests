@new-returns @with-test-data
Feature: External user can inform DEFRA if thier meter reset in the abstraction period

   As an external user
   I want to inform DEFRA if my meter reset in the abstraction period
   So that I can supply meter readings or volumes

  Background: User is logged in
    Given I log in at the external test user
    And I navigate to the external "due" test return
    And I progress through the external returns flow
      | origin                              | answer   |
      | Have you abstracted water           | Yes      |
      | How are you reporting your figures  | Readings |

Scenario: Did your meter reset in this abstraction period
  Then the "Did your meter reset" page displays the expected details for the test return

Scenario: Did your meter reset page validation
  And I submit no answer on the "Did your meter reset" page
  Then the Did your meter reset page displays validation errors

Scenario: If the meter reset in the abstraction period
  And I choose "yes" on the "Did your meter reset" page
  Then I am informed that I must provide abstraction volumes

Scenario: Did your meter reset routes to expected destination
  Then I submit a valid answer and am routed to the expected page
    | origin               | answer | destination |
    | Did your meter reset | Yes    | Which units |
    | Did your meter reset | No     | Which units |

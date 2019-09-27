@new-returns @with-test-data
Feature: External user can inform DEFRA if they have abstracted water

   As an external user
   I want to inform DEFRA if I have abstracted water in the return period
   So that I can meet the requirements of the licence

  Background: User is logged in
    Given I log in at the external test user
    And I navigate to the external "due" test return

Scenario: Have you abstracted water page details
  Then the "Have you abstracted water" page displays the expected details for the test return

Scenario: Have you abstracted water page validation
  And I submit no answer on the Have you abstracted water page
  Then the Have you abstracted water page displays the validation errors

Scenario: Have you abstracted water routes to expected destination
  Then I submit a valid answer and am routed to the expected page
    | origin                    | answer | destination                        |
    | Have you abstracted water | Yes    | How are you reporting your figures |
    | Have you abstracted water | No     | Nil return                         |

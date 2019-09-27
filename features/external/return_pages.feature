@new-returns @with-test-data
Feature: External user can follow the returns flow

   As an external user
   I want to be able to submit my returns
   So that I can meet the requirements of the licence

  Background: User is logged in
    Given I log in at the external test user
    And I navigate to the external "due" test return

Scenario: Have you abstracted water details
  Then the Have you abstracted water page displays the expected details

Scenario: Have you abstracted water validation
  And I submit no answer on the Have you abstracted water page
  Then the Have you abstracted water page displays the validation errors

Scenario: Have you abstracted water routes to expected destination
  Then I submit a valid answer and am routed to the expected page
    | origin                    | answer | destination                        |
    | Have you abstracted water | Yes    | How are you reporting your figures |
    | Have you abstracted water | No     | Nil return                         |

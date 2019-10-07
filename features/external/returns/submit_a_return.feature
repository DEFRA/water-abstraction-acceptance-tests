@new-returns @with-test-data
Feature: External user can complete returns

   As an external user
   I want to complete my return
   So that I can meet the requirements of the licence

  Background: User is logged in
    Given I log in at the external test user
    And I navigate to the external "due" "monthly" return

Scenario: User can submit a nil return
  And I progress through the external returns flow
    | origin                     | answer | return_frequency |
    | Have you abstracted water  | No     | monthly          |
    | Nil return                 | Submit | monthly          |
  Then I am on the "Submitted" page of the external returns flow
  And the "Submitted" page displays the expected details for the "monthly" return


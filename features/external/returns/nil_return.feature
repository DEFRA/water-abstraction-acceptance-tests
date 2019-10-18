@new-returns @use-test-data
Feature: External user is shown relevant information on the nil returns page

   As an external user
   I want to see my returns data on the nil return page
   So that I can meet the requirements of the licence

  Background: User is logged in
    Given I log in at the external test user
    And I navigate to the external "due" "monthly" return
    And I answer "no" on the "Have you abstracted water" page

Scenario: Nil return page details
  Then I am on the "Nil return" page of the external returns flow
  And the "Nil return" page displays the expected details for the "monthly" return

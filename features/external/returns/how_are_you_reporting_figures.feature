@new-returns @use-test-data
Feature: External user can inform DEFRA how they are reporting the figures

   As an external user
   I want to inform DEFRA how I have gathered my abstraction details
   So that I can meet the requirements of the licence

  Background: User is logged in
    Given I log in at the external test user
    And I navigate to the external "due" "monthly" return
    And I progress through the external returns flow
      | origin                     | answer | return_frequency |
      | Have you abstracted water  | Yes    | monthly          |

Scenario: Have you abstracted water page details
  Then the "How are you reporting your figures" page displays the expected details for the "monthly" return

Scenario: How are you reporting your figures page validation
  And I submit no answer on the "How are you reporting your figures" page
  Then the How are you reporting your figures page displays validation errors

Scenario: How are you reporting your figures routes to expected destination
  Then I submit a valid answer and am routed to the expected page
    | origin                             | answer    | return_frequency | destination          |
    | How are you reporting your figures | Readings  | monthly          | Did your meter reset |
    | How are you reporting your figures | Volumes   | monthly          | Which units          |
    | How are you reporting your figures | Estimates | monthly          | Which units          |

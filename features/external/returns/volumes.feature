@new-returns @use-test-data
Feature: External user can enter returns volumes

 Background: User is logged in
    Given I log in at the external test user
    And I navigate to the external "due" "monthly" return
    And I progress through the external returns flow
      | origin                             | answer   | return_frequency |
      | Have you abstracted water          | Yes      | monthly          |
      | How are you reporting your figures | Volumes  | monthly          |
      | Which units                        | Litres   | monthly          |

Scenario: Enter volumes page is ready for input
  Then the "Enter volumes" page displays the expected details for the "monthly" return

Scenario: Entering valid data routes to expected destination
  Then I submit a valid answer and am routed to the expected page
    | origin        | answer            | return_frequency | destination   |
    | Enter volumes | Empty volumes     | monthly          | Meter details |
    | Enter volumes | Identical volumes | monthly          | Meter details |

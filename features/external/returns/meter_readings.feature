@new-returns @use-test-data
Feature: External user can enter returns meter readings

 Background: User is logged in
    Given I log in at the external test user
    And I navigate to the external "due" "monthly" return
    And I progress through the external returns flow
      | origin                             | answer   | return_frequency |
      | Have you abstracted water          | Yes      | monthly          |
      | How are you reporting your figures | Readings | monthly          |
      | Did your meter reset               | No       | monthly          |
      | Which units                        | Litres   | monthly          |

Scenario: Enter meter readings page is ready for input
  Then the "Enter meter readings" page displays the expected details for the "monthly" return

Scenario: Entering nothing causes a validation error
  And I submit no answer on the "Enter meter readings" page
  Then the Enter meter readings page asks for a start reading

Scenario: Entering a start reading only progresses to the meter detail page
  And I answer "start reading only" on the "Enter meter readings" page
  Then I am on the "Meter details" page of the external returns flow

Scenario: Entering a start reading and higher meter readings progresses to the meter detail page
  And I answer "valid readings" on the "Enter meter readings" page
  Then I am on the "Meter details" page of the external returns flow

Scenario: Entering a start reading and equal meter readings progresses to the meter detail page
  And I answer "valid equal readings" on the "Enter meter readings" page
  Then I am on the "Meter details" page of the external returns flow

Scenario: Entering a start reading and lower meter readings causes a validation error
  And I answer "invalid readings" on the "Enter meter readings" page
  Then I am on the "Enter meter readings" page of the external returns flow
  And the Enter meter readings page asks for valid readings


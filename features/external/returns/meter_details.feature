@new-returns @use-test-data
Feature: External user can enter detail about thier meter

 Background: User is logged in
    Given I log in at the external test user
    And I navigate to the external "due" "monthly" return
    And I progress through the external returns flow
      | origin                             | answer             | return_frequency |
      | Have you abstracted water          | Yes                | monthly          |
      | How are you reporting your figures | Readings           | monthly          |
      | Did your meter reset               | No                 | monthly          |
      | Which units                        | Litres             | monthly          |
      | Enter meter readings               | Start reading only | monthly          |

Scenario: Enter meter details page is ready for input
  Then the "Meter details" page displays the expected details for the "monthly" return

Scenario: Entering nothing causes a validation error
  And I submit no answer on the "Meter details" page
  Then the Meter details page asks for the meter manufacturer
  Then the Meter details page asks for the meter serial number

Scenario: Entering a the meter make only causes a validation error
  And I answer "meter make only" on the "Meter details" page
  Then I am on the "Meter details" page of the external returns flow
  And the Meter details page asks for the meter serial number

Scenario: Entering a the meter serial number only causes a validation error
  And I answer "serial number only" on the "Meter details" page
  Then I am on the "Meter details" page of the external returns flow
  And the Meter details page asks for the meter manufacturer

Scenario: Entering valid data progresses to the confirmation page
  And I answer "valid readings" on the "Meter details" page
  Then I am on the "Confirm return" page of the external returns flow

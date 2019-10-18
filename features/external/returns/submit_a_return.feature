@new-returns @use-test-data
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

Scenario: User can submit a return based on meter readings
  And I progress through the external returns flow
    | origin                             | answer         | return_frequency |
    | Have you abstracted water          | Yes            | monthly          |
    | How are you reporting your figures | Readings       | monthly          |
    | Did your meter reset               | No             | monthly          |
    | Which units                        | Litres         | monthly          |
    | Enter meter readings               | Valid readings | monthly          |
    | Meter details                      | Valid readings | monthly          |
    | Confirm return                     | Submit         | monthly          |
  Then I am on the "Submitted" page of the external returns flow
  And the "Submitted" page displays the expected details for the "monthly" return

Scenario: User can submit a return based on meter readings with an edit
  And I progress through the external returns flow
    | origin                             | answer         | return_frequency |
    | Have you abstracted water          | Yes            | monthly          |
    | How are you reporting your figures | Readings       | monthly          |
    | Did your meter reset               | No             | monthly          |
    | Which units                        | Litres         | monthly          |
    | Enter meter readings               | Valid readings | monthly          |
    | Meter details                      | Valid readings | monthly          |
    | Confirm return                     | Edit readings  | monthly          |
    | Enter meter readings               | Valid readings | monthly          |
    | Meter details                      | Valid readings | monthly          |
    | Confirm return                     | Submit         | monthly          |
  Then I am on the "Submitted" page of the external returns flow
  And the "Submitted" page displays the expected details for the "monthly" return

Scenario: User can submit a return based on recorded volumes
  And I progress through the external returns flow
    | origin                             | answer         | return_frequency |
    | Have you abstracted water          | Yes            | weekly           |
    | How are you reporting your figures | Volumes        | weekly           |
    | Which units                        | Litres         | weekly           |
    | Enter volumes                      | Valid readings | weekly           |
    | Meter details                      | Valid readings | weekly           |
    | Confirm return                     | Submit         | weekly           |
  Then I am on the "Submitted" page of the external returns flow
  And the "Submitted" page displays the expected details for the "weekly" return

Scenario: User can submit a return based on recorded volumes with an edit
  And I progress through the external returns flow
    | origin                             | answer         | return_frequency |
    | Have you abstracted water          | Yes            | weekly           |
    | How are you reporting your figures | Volumes        | weekly           |
    | Which units                        | Litres         | weekly           |
    | Enter volumes                      | Valid readings | weekly           |
    | Meter details                      | Valid readings | weekly           |
    | Confirm return                     | Edit volumes   | weekly           |
    | Enter volumes                      | Valid readings | weekly           |
    | Meter details                      | Valid readings | weekly           |
    | Confirm return                     | Submit         | weekly           |
  Then I am on the "Submitted" page of the external returns flow
  And the "Submitted" page displays the expected details for the "weekly" return

Scenario: User can submit a return based on estimates
  And I progress through the external returns flow
    | origin                             | answer         | return_frequency |
    | Have you abstracted water          | Yes            | daily            |
    | How are you reporting your figures | Estimates      | daily            |
    | Which units                        | Litres         | daily            |
    | Enter volumes                      | Valid readings | daily            |
    | Confirm return                     | Submit         | daily            |
  Then I am on the "Submitted" page of the external returns flow
  And the "Submitted" page displays the expected details for the "daily" return

Scenario: User must submit volumes if thier meter reset
  And I progress through the external returns flow
    | origin                             | answer         | return_frequency |
    | Have you abstracted water          | Yes            | monthly          |
    | How are you reporting your figures | Readings       | monthly          |
    | Did your meter reset               | Yes            | monthly          |
    | Which units                        | Litres         | monthly          |
    | Enter volumes                      | Valid readings | monthly          |
    | Meter details                      | Valid readings | monthly          |
    | Confirm return                     | Submit         | monthly          |
  Then I am on the "Submitted" page of the external returns flow
  And the "Submitted" page displays the expected details for the "monthly" return

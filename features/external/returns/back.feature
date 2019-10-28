# @new-returns @use-test-data
# Feature: External user can use the back button in the returns flows

#    As an external user
#    I want to navigate to the previous page
#    So that I can get to the previous screen

#   Background: User is logged in
#     Given I log in at the external test user
#     And I navigate to the external "due" "monthly" return

# Scenario: User can navigate back during the meter readings flow
#   And I progress through the external returns flow
#     | origin                             | answer         | return_frequency |
#     | Have you abstracted water          | Yes            | monthly          |
#     | How are you reporting your figures | Readings       | monthly          |
#     | Did your meter reset               | No             | monthly          |
#     | Which units                        | Litres         | monthly          |
#     | Enter meter readings               | Valid readings | monthly          |
#     | Meter details                      | Valid readings | monthly          |
#     | Confirm return                     | Back           | monthly          |
#     | Meter details                      | Back           | monthly          |
#     | Enter meter readings               | Back           | monthly          |
#     | Which units                        | Back           | monthly          |
#     | Did your meter reset               | Back           | monthly          |
#     | How are you reporting your figures | Back           | monthly          |
#   Then I am on the "Have you abstracted water" page of the external returns flow

# Scenario: User can navigate back during the volumes flow
#   And I progress through the external returns flow
#     | origin                             | answer         | return_frequency |
#     | Have you abstracted water          | Yes            | weekly           |
#     | How are you reporting your figures | Volumes        | weekly           |
#     | Which units                        | Litres         | weekly           |
#     | Enter volumes                      | Valid readings | weekly           |
#     | Meter details                      | Valid readings | weekly           |
#     | Confirm return                     | Back           | weekly           |
#     | Meter details                      | Back           | weekly           |
#     | Enter volumes                      | Back           | weekly           |
#     | Which units                        | Back           | weekly           |
#     | How are you reporting your figures | Back           | weekly           |
#   Then I am on the "Have you abstracted water" page of the external returns flow

# Scenario: User can navigate back during the estimates flow
#   And I progress through the external returns flow
#     | origin                             | answer         | return_frequency |
#     | Have you abstracted water          | Yes            | daily            |
#     | How are you reporting your figures | Estimates      | daily            |
#     | Which units                        | Litres         | daily            |
#     | Enter volumes                      | Valid readings | daily            |
#     | Confirm return                     | Back           | daily            |
#     | Enter volumes                      | Back           | daily            |
#     | Which units                        | Back           | daily            |
#     | How are you reporting your figures | Back           | daily            |
#   Then I am on the "Have you abstracted water" page of the external returns flow

# Scenario: User can navigate back during the volumes flow when the meter reset
#   And I progress through the external returns flow
#     | origin                             | answer         | return_frequency |
#     | Have you abstracted water          | Yes            | monthly          |
#     | How are you reporting your figures | Readings       | monthly          |
#     | Did your meter reset               | Yes            | monthly          |
#     | Which units                        | Litres         | monthly          |
#     | Enter volumes                      | Valid readings | monthly          |
#     | Meter details                      | Valid readings | monthly          |
#     | Confirm return                     | Back           | monthly          |
#     | Meter details                      | Back           | monthly          |
#     | Enter volumes                      | Back           | monthly          |
#     | Which units                        | Back           | monthly          |
#     | Did your meter reset               | Back           | monthly          |
#     | How are you reporting your figures | Back           | monthly          |
#   Then I am on the "Have you abstracted water" page of the external returns flow

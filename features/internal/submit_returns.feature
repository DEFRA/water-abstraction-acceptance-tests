@csg
Feature: External flows where user can submit returns through various paths

  Scenario:
    Given I am on the sign in page for "internal_user"
    And I sign into my account as "internal_user"
#    And I can access my returns overview
    When I "submit" a return of type "volume"
#    And I input "yes" for "Have_you_abstracted_water_in_this_return_period"
#    Then I can view a return that is "populated daily"
#    And I can't see the NALD reference
#    And I can check the licence details
#    And I can view a return that is "due"
#    And I am on the abstraction licences page

#  Scenario: Input returns through estimates flow as an external user.
#    When I click on "returns"
#    And I select the return that is "due"
#    And I input "yes" for "Have_you_abstracted_water_in_this_return_period"
#    And I input "Estimates_without_a_meter" for "How_are_you_reporting_your_figures"
#    And I input "Megalitres" for "Which_units_are_you_using"
#    And I input values for abstraction volumes
#      |box1|box2|box3|box4|box5|
#      |4000|4800|4900|5000|6500|
#    And When I click on "submit"
#    Then I should see "return_submitted" page
#
#  Scenario: Input returns through meter with rollovers flow as an external user.
#    When I click on "returns"
#    And I select the return that is "due"
#    And I input "yes" for "Have_you_abstracted_water_in_this_return_period"
#    And I input "Readings_from_a_single_meter" for "How_are_you_reporting_your_figures"
#    And I input "yes" for "Did_your_meter_reset_in_this_abstraction_period"
#    And I input "Cubic_meters" for "Which_units_are_you_using"
#    And I input values for abstraction volumes
#      |box1|box2|box3|box4|box5|
#      |4000|4800|4900|5000|6500|
#    And  And I input meter details
#      |make|serial_number|
#      |Test|123456|
#    And When I click on "submit"
#    Then I should see "return_submitted" page
#
#  Scenario: Input returns through multiple meters or volumes flow as an external user.
#    When I click on "returns"
#    And I select the return that is "due"
#    And I input "yes" for "Have_you_abstracted_water_in_this_return_period"
#    And I input "Volumes_from_one_or_more_meters" for "How_are_you_reporting_your_figures"
#    And I input "Cubic_meters" for "Which_units_are_you_using"
#    And I input values for abstraction volumes
#      |box1|box2|box3|box4|box5|
#      |4000|4800|4900|5000|6500|
#    And  And I input meter details
#      |make|serial_number|
#      |Test|123456|
#    And When I click on "submit"
#    Then I should see "return_submitted" page
#
#  Scenario: Input returns through nil return flow as an external user.
#    When I click on "returns"
#    And I select the return that is "due"
#    And I input "no" for "Have_you_abstracted_water_in_this_return_period"
#    And When I click on "submit"
#    Then I should see "return_submitted" page
#
#  Scenario: Input returns through one meter flow as an external user.
#    When I click on "returns"
#    And I select the return that is "due"
#    And I input "yes" for "Have_you_abstracted_water_in_this_return_period"
#    And I input "Readings_from_a_single_meter" for "How_are_you_reporting_your_figures"
#    And I input "no" for "Did_your_meter_reset_in_this_abstraction_period"
#    And I input "Cubic_meters" for "Which_units_are_you_using"
#    And I input values for abstraction volumes
#      |box1|box2|box3|box4|box5|
#      |4000|4800|4900|5000|6500|
#    And  And I input meter details
#      |make|serial_number|
#      |Test|123456|
#    And When I click on "submit"
#    Then I should see "return_submitted" page

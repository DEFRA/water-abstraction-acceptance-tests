@readwrite @bs
Feature: [WATER-1013] Notify user of hands off flow
  As an internal user
  I want to send a notification to licence holders
  So that they abstract water sustainably

  Background:
    Given I sign into my account as "water_user1"
    And I am on the internal abstraction licences page
    And I go to the notifications screen

  Scenario: [WATER-1013 and 932] Send hands off flow warning and check log
    When I select the hands off flow template
    Then I am on the notification add licences page

    When I add licences for a notification
    Then I am on the notification custom information page

    When I add custom information
    Then I can see the correct information on the confirm message page

    When I send the notification
    Then I can see the correct information on the confirm sent page

    When I check the log
    Then the notifications appear in the log
    And I can view the details of the latest batch

  Scenario: [WATER-1013] Invalid data
    Given I select the hands off flow template
    And I am on the notification add licences page
    When I select no licences
    Then I see an error message telling me I need at least one licence

    Given I add licences for a notification
    And I am on the notification custom information page
    When I leave mandatory fields blank
    Then I see an error message telling me to enter missing data

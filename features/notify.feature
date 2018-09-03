@readwrite @bs
Feature: [WATER-1013] Notify user of hands off flow
  As an internal user
  I want to send a notification to licence holders
  So that they abstract water sustainably

  Background:
    Given I am on the sign in page
    And I sign into my account as "internal_user"
    And I am on the internal abstraction licences page
    And I go to the notifications screen

  Scenario: [WATER-1125] Autopopulate contact details
    When I remove my contact information
    And I am on the internal abstraction licences page
    And I go to the notifications screen
    Then I am prompted to add my contact details

    When I add licences for a notification
    Then I am on the notification custom information page
    And I can see my autopopulated details

  Scenario: [WATER-1013 and 932] Send hands off flow warning and check log
    When I select the hands off flow warning template
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

  Scenario: [WATER-1013 and 932] Send hands off flow stop and check log
    When I select the hands off flow stop template
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

  Scenario: [WATER-1013 and 932] Send hands off flow resume and check log
    When I select the hands off flow resume template
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

  Scenario: [WATER-1013 and 932] Send expiry notification and check log
    When I select the expiry notification template
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
    Given I select the hands off flow warning template
    And I am on the notification add licences page
    When I select no licences
    Then I see an error message telling me I need at least one licence

    Given I add licences for a notification
    And I am on the notification custom information page
    When I leave mandatory fields blank
    Then I see an error message telling me to enter missing data

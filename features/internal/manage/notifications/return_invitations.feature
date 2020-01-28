@use-internal-test-data @notifications @wip
Feature: Internal user is able to send returns invitations

  As an internal user
  I want to be able to send returns invitations
  So that I can invite licence holders to complete their returns

  Background: 
    Given I logged in as "billing_and_data" user
    And I navigate to the "Manage" section
    And I navigate to the "returns invitations" page

  Scenario: User can send returns invitations to all relevant licences
    When I exclude "no" licences
    Then I can see the waiting page
    And I can confirm sending the returns invitations
    And I can see the returns invitations success page

  Scenario: User can send returns invitations excluding some licences
    When I exclude "some" licences
    Then I can see the waiting page
    And I can confirm sending the returns invitations
    And I can see the returns invitations success page
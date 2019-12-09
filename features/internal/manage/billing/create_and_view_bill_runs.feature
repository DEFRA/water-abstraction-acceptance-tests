@use-internal-test-data @billing
Feature: Create and View bill runs
  As a Billing and Data user
  I want to be able to trigger and view bill runs for my region so that
  I can ensure customers receive accurate bills as soon as possible after their licence starts or changes.
  Note: This feature will not be releasing to production for the moment.

  Scenario Outline: [WATER-2386] Create a supplementary bill run
    Given I logged in as <user> user
    And I navigate to the "Manage" section
    When I trigger a "Supplementary" bill run for <region> region
    Then I can see the "bill run started"
    Examples:
      | user             | region     |
      | billing_and_data | Anglian    |
      | super            | South West |

  Scenario Outline: [WATER-2386] View past and open bill runs
    Given I logged in as <user> user
    And I navigate to the "Manage" section
    When I select the past and open bill runs option
    Then I can see the "bill runs"
    Examples:
      | user             |
      | billing_and_data |
      | super            |

  Scenario Outline: [WATER-2386] Users without billing and data permission can't see the billing section
    Given I logged in as <user> user
    When I navigate to the "Manage" section
    Then I can't see the billing section
    Examples:
      | user |
      | wirs |
      | nps  |
      | psc  |

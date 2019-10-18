@new-returns @use-test-data
Feature: External user is not shown a link for bulk uploads

  Background: User is logged in
    Given I log in at the external test user
    And I navigate to the manage returns page

# 2302 - The link has been disabled for now for all users
# The test return created is configured to allow bulk uploads
# so this test ensures that the link is not shown on the page.
Scenario: User does not see bulk returns link
  Then I cannot see the bulk returns upload link

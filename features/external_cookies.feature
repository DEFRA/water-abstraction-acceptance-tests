@test @cookies @preprod
Feature: Users seeing the site for the first time should know about cookies

Background: User is logged in
  Given I am on the sign in page for "external_user"
  And I sign into my account as "external_user"

Scenario: A first time user should see the cookie banner
  Then the cookie banner is shown

Scenario: A returning user should not see the cookie banner
  Then I navigate to the account settings page
  Then the cookie banner is not shown

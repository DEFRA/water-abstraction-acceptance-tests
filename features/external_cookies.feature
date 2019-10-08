@test @cookies @preprod
Feature: Users seeing the site for the first time should know about cookies

Scenario: A first time user should see the cookie banner
  Given I navigate to the cookies page
  Then the cookie banner is shown

Scenario: A returning user should not see the cookie banner
  Given I navigate to the cookies page
  Then I navigate to the privacy policy page
  Then the cookie banner is not shown

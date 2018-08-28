
Given(/^I am on the sign in page$/) do
  @front_app = FrontOfficeApp.new
  @front_app.sign_in_page.load
end

Given(/^I sign into my account as "([^"]*)"$/) do |account|
  @environment = Quke::Quke.config.custom["environment"].to_s
  @front_app.sign_in_page.load
  @front_app.sign_in_page.submit(
    email: Quke::Quke.config.custom["data"]["accounts"][account.to_s],
    password: Quke::Quke.config.custom["data"]["accounts"]["password"]
  )
end

When(/^I enter my password incorrectly$/) do
  @front_app.sign_in_page.submit(
    email: Quke::Quke.config.custom["data"]["accounts"]["external_user"],
    password: "@3kjldjfa@"
  )
end

When(/^I enter blank details$/) do
  @front_app.sign_in_page.submit(
    email: "",
    password: ""
  )
end

Then(/^I am informed "([^"]*)"$/) do |message|
  expect(@front_app.sign_in_page).to have_text(message)
end

Given(/^I lock my account by attempting to sign in with an incorrect password too many times$/) do
  @front_app = FrontOfficeApp.new
  @front_app.sign_in_page.load
  # Locks account after ten unsuccessful attempts
  @account_to_lock = Quke::Quke.config.custom["data"]["accounts"]["external_user"]
  @front_app.sign_in_page.lock_account(email: @account_to_lock)
end

When(/^I unlock my account using the email link provided$/) do
  # Use email API.  Copy step syntax from register_steps.rb
end

Then(/^I can sign into my account$/) do
  within_window @new_window do
    expect(@front_app.licences_page.current_url).to include "licences"
  end
end

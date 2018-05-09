
Given(/^I sign into my account as "([^"]*)"$/) do |account|
  @environment = Quke::Quke.config.custom["current_environment"].to_s
  @front_app = FrontOfficeApp.new
  @front_app.sign_in_page.load
  @front_app.sign_in_page.submit(
    email: Quke::Quke.config.custom["data"][@environment]["accounts"][account.to_s]["username"],
    password: Quke::Quke.config.custom["data"][@environment]["accounts"][account.to_s]["password"]
  )
end

Given(/^I am on the sign in page$/) do
  @front_app = FrontOfficeApp.new
  @front_app.sign_in_page.load
end

When(/^I enter my password incorrectly$/) do
  @environment = Quke::Quke.config.custom["current_environment"].to_s
  @front_app.sign_in_page.submit(
    email: Quke::Quke.config.custom["data"][@environment]["accounts"]["water_user2"]["username"],
    password: "@3kjldjfa@"
  )
end

When(/^I enter blank details$/) do
  @environment = Quke::Quke.config.custom["current_environment"].to_s
  @front_app.sign_in_page.submit(
    email: "",
    password: ""
  )
end

Then(/^I am informed "([^"]*)"$/) do |message|
  expect(@front_app.sign_in_page).to have_text(message)
end

Given(/^I lock my account by attempting to sign in with an incorrect password too many times$/) do
  @environment = Quke::Quke.config.custom["current_environment"].to_s
  @front_app = FrontOfficeApp.new
  @front_app.sign_in_page.load
  # Locks account after ten unsuccessful attempts
  @account_to_lock = Quke::Quke.config.custom["data"][@environment]["accounts"]["water_user2"]["username"]
  @front_app.sign_in_page.lock_account(email: @account_to_lock)
end

When(/^I unlock my account using the email link provided$/) do
  @environment = Quke::Quke.config.custom["current_environment"].to_s
  @mailinator_username = Quke::Quke.config.custom["data"][@environment]["accounts"]["water_user2"]["username"]
  @front_app.mailinator_home_page.load
  @front_app.mailinator_home_page.submit(inbox: @mailinator_username)
  @front_app.mailinator_inbox_page.email[0].from.click

  @front_app.mailinator_inbox_page.email_details do |frame|
    @new_window = window_opened_by { frame.reset_password.click }
  end

  within_window @new_window do
    @front_app.reset_password_page.submit(
      password: Quke::Quke.config.custom["data"][@environment]["accounts"]["water_user2"]["password"],
      confirm_password: Quke::Quke.config.custom["data"][@environment]["accounts"]["water_user2"]["password"]
    )
  end
end

Then(/^I can sign into my account$/) do
  within_window @new_window do
    expect(@front_app.licences_page.current_url).to include "licences"
  end
end

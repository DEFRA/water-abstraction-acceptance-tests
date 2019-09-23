
Given(/^I select Change Password$/) do
  @front_app.licences_page.wait_until_account_settings_visible
  # Wait for helps because the page object is not always found straight away on load
  @front_app.licences_page.account_settings.click
  @front_app.licences_page.change_password.click
end

Given(/^I am on the Change Password page$/) do
  expect(@front_app.change_password_page.header).to have_text("Change your password")
  expect(@front_app.change_password_page.current_url).to include "/account/update-password"
end

Given(/^I enter my correct password$/) do
  @front_app.change_password_reauthenticate_page.submit(
    password: config_accounts("password")
  )
end

Given(/^I enter a password which is too short$/) do
  @front_app.change_password_page.submit(
    password: "Is$h0rt",
    confirmpw: "Is$h0rt"
  )
end

Given(/^I enter a password with no uppercase letters$/) do
  @front_app.change_password_page.submit(
    password: "low£rcase",
    confirmpw: "low£rcase"
  )
end

Given(/^I enter a password with no symbols$/) do
  @front_app.change_password_page.submit(
    password: "N0symbol",
    confirmpw: "N0symbol"
  )
end

Given(/^I enter valid passwords which don't match$/) do
  @front_app.change_password_page.submit(
    password: "S0mething?",
    confirmpw: "S0mething!"
  )
end

Given(/^I see an error telling me the password is invalid$/) do
  expect(@front_app.change_password_page.error_heading.text).to include "There is a problem"
end

Given(/^I see an error telling me the passwords don't match$/) do
  expect(@front_app.change_password_page.error_heading.text).to include "There is a problem"
end

Given(/^I enter a valid password$/) do
  password = config_accounts("password")
  @front_app.change_password_page.submit_password(password)
end

Given(/^I see the Password Changed screen$/) do
  expect(@front_app.change_password_confirm_page.confirmation.text).to include "Your password has been changed"
end

Given(/^I request a password reset as an "([^"]*)"$/) do |account|
  @environment = config_environment
  # If in prod, switch to internal user because an external user won't work:
  account = "internal_user" if production? == true
  puts "Account: " + account
  # Record the user type for different tests
  @user_type = account.to_s
  @password_reset_email = config_accounts(account.to_s)

  @front_app.sign_in_page.forgotten_password.click
  if @front_app.request_pw_reset_page.has_email_address2?
    @front_app.request_pw_reset_page.submit2(
      email_address: @password_reset_email
    )
  else
    @front_app.request_pw_reset_page.submit(
      email_address: @password_reset_email
    )
  end

  # Also test the "not received email" link:
  find_link("Has the email not arrived?").click
  expect(@front_app.request_pw_reset_page.paragraph).to have_text("The email might take a few minutes to reach you")
  if @front_app.request_pw_reset_page.has_email_address2?
    @front_app.request_pw_reset_page.submit2(
      email_address: @password_reset_email
    )
  else
    @front_app.request_pw_reset_page.submit(
      email_address: @password_reset_email
    )
  end
end

Given(/^I am on the Check Your Email page$/) do
  expect(@front_app.reset_password_check_page.heading.text).to include "Check your email"
end

Given(/^I can reset my password$/) do
  environment = config_environment

  unless %w[preprod prod].include? environment

    # rubocop:disable Metrics/LineLength
    email_api_url = ((Quke::Quke.config.custom["urls"][environment]["root_url"]) + "notifications/last?email=" + @password_reset_email).to_s
    # rubocop:enable Metrics/LineLength
    puts email_api_url
    visit email_api_url

    email_json = @front_app.email_content_page.email_content.text

    # Find text between: once):\r\n\r\n#
    # and: \r\n\r\n^ If
    @unlock_account_url = email_json[/\\r\\n\\r\\n#(.*?)\\r\\n\\r\\nIf/, 1].to_s
    visit(@unlock_account_url)

    password = config_accounts("password")
    @front_app.register_create_pw_page.submit_password(password)
  end
end
